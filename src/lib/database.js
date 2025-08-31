// ===========================================
// ALIBABA CLOUD RDS MYSQL DATABASE CONNECTION
// ===========================================

import mysql from 'mysql2/promise';
import cloudConfig from '../../cloud-db-config.js';

// Database configuration - Cloud First, Local Fallback
const config = {
  database: {
    // Primary: Alibaba Cloud RDS Internal Connection
    host: process.env.DB_HOST || cloudConfig.primary.host,
    user: process.env.DB_USER || cloudConfig.primary.user,
    password: process.env.DB_PASSWORD || cloudConfig.primary.password,
    database: process.env.DB_NAME || cloudConfig.primary.database,
    port: process.env.DB_PORT || cloudConfig.primary.port,

    // Connection pool settings
    waitForConnections: true,
    connectionLimit: cloudConfig.primary.connectionLimit,
    queueLimit: cloudConfig.primary.queueLimit,

    // Character set and timezone
    timezone: cloudConfig.primary.timezone,
    charset: cloudConfig.primary.charset,

    // SSL for Alibaba Cloud RDS
    ssl: cloudConfig.primary.ssl
  },

  // Fallback configuration
  fallback: {
    host: process.env.DB_HOST_EXTERNAL || cloudConfig.external.host,
    user: process.env.DB_USER || cloudConfig.external.user,
    password: process.env.DB_PASSWORD || cloudConfig.external.password,
    database: process.env.DB_NAME || cloudConfig.external.database,
    port: process.env.DB_PORT_EXTERNAL || cloudConfig.external.port,
    // No SSL for fallback connection
    connectionLimit: 5,
    timeout: 30000
  }
};

// Enhanced error handler for database operations
export function handleDatabaseError(error, operation = 'Database operation') {
  console.error(`❌ ${operation} failed:`, error.message);

  const errorTypes = {
    'ECONNREFUSED': 'Database server is not reachable',
    'ER_ACCESS_DENIED_ERROR': 'Invalid database credentials',
    'ER_BAD_DB_ERROR': 'Database does not exist',
    'ETIMEDOUT': 'Connection timeout - check network/VPC settings',
    'ENOTFOUND': 'Database host not found',
    'ER_PARSE_ERROR': 'SQL syntax error',
    'ER_DUP_ENTRY': 'Duplicate entry in database',
    'ER_NO_SUCH_TABLE': 'Table does not exist'
  };

  const errorType = error.code || 'UNKNOWN_ERROR';
  const friendlyMessage = errorTypes[errorType] || 'Unknown database error';

  return {
    success: false,
    error: error.message,
    errorType,
    friendlyMessage,
    suggestions: getErrorSuggestions(errorType)
  };
}

function getErrorSuggestions(errorType) {
  const suggestions = {
    'ECONNREFUSED': [
      'Check if Alibaba Cloud RDS instance is running',
      'Verify security group allows connections',
      'Check if instance is in the correct VPC'
    ],
    'ER_ACCESS_DENIED_ERROR': [
      'Verify database username and password',
      'Check if user has proper permissions',
      'Ensure user exists in the database'
    ],
    'ER_BAD_DB_ERROR': [
      'Create the database in Alibaba Cloud console',
      'Check database name spelling',
      'Verify user has access to the database'
    ],
    'ETIMEDOUT': [
      'Check VPC network configuration',
      'Verify IP is in whitelist',
      'Try external connection endpoint',
      'Check firewall settings'
    ],
    'ENOTFOUND': [
      'Verify database host address',
      'Check DNS resolution',
      'Ensure correct region/endpoint'
    ],
    'ER_PARSE_ERROR': [
      'Check SQL syntax',
      'Verify table and column names',
      'Ensure proper quoting of identifiers'
    ]
  };

  return suggestions[errorType] || [
    'Check database configuration',
    'Verify network connectivity',
    'Contact system administrator'
  ];
}

// Create connection pool with enhanced error handling
const pool = mysql.createPool({
  ...config.database,
  // Connection settings
  connectTimeout: 15000
});

// Test connection function with cloud fallback and retry
export async function testConnection(maxRetries = 3) {
  let connectionType = 'internal';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Attempting connection (attempt ${attempt}/${maxRetries})...`);

      const connection = await pool.getConnection();
      console.log('✅ MySQL connection successful!');
      console.log(`📊 Connected to database: ${config.database.database}`);
      console.log(`🌐 Connection type: Alibaba Cloud RDS (${connectionType})`);
      console.log(`🏢 Host: ${config.database.host}`);

      // Test a simple query
      await connection.execute('SELECT 1');
      connection.release();
      return { success: true, type: connectionType, host: config.database.host };
    } catch (primaryError) {
      console.warn(`❌ Primary connection attempt ${attempt} failed:`, primaryError.message);

      if (attempt === maxRetries) {
        // Try fallback connection on final attempt
        console.log('🔄 Attempting fallback connection...');
        connectionType = 'external';

        try {
          const fallbackPool = mysql.createPool(config.fallback);
          const connection = await fallbackPool.getConnection();
          console.log('✅ Fallback (External) connection successful!');
          console.log(`📊 Connected to database: ${config.fallback.database}`);
          console.log(`🌐 Connection type: Alibaba Cloud RDS (${connectionType})`);
          console.log(`🏢 Host: ${config.fallback.host}`);

          // Test a simple query
          await connection.execute('SELECT 1');
          connection.release();
          await fallbackPool.end();
          return { success: true, type: connectionType, host: config.fallback.host };
        } catch (fallbackError) {
          console.error('❌ Fallback connection also failed:', fallbackError.message);
          return {
            success: false,
            error: fallbackError.message,
            suggestions: [
              '1. Check Alibaba Cloud RDS instance is running',
              '2. Verify IP is in whitelist',
              '3. Check VPC network configuration',
              '4. Ensure database user exists and has permissions'
            ]
          };
        }
      }

      // Wait before retry
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting before retry... (${2000 * attempt}ms)`);
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
}

// Enhanced query helper function with error handling
export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    const errorResult = handleDatabaseError(error, 'Database query');
    console.error('❌ Query execution failed:', errorResult.friendlyMessage);
    console.error('💡 Suggestions:', errorResult.suggestions.join('\n   - '));
    throw error;
  }
}

// Enhanced transaction helper function
export async function transaction(callback) {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    console.log('✅ Transaction completed successfully');
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.log('⚠️ Transaction rolled back due to error');
    }

    const errorResult = handleDatabaseError(error, 'Database transaction');
    console.error('❌ Transaction failed:', errorResult.friendlyMessage);
    console.error('💡 Suggestions:', errorResult.suggestions.join('\n   - '));
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Health check function
export async function healthCheck() {
  try {
    await pool.execute('SELECT 1');
    return {
      status: 'healthy',
      database: config.database.database,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MySQL connection pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing MySQL connection pool...');
  await pool.end();
  process.exit(0);
});

export default pool;
