// ===========================================
// ALIBABA CLOUD RDS MYSQL CONFIGURATION
// Using Environment Variables from .env
// ===========================================

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const cloudDbConfig = {
  // Primary Internal Connection (Recommended for VPC)
  primary: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'yapee_user',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'yapee_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
    timezone: process.env.DB_TIMEZONE || '+08:00',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
    // SSL for Alibaba Cloud RDS
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  },

  // External Connection (Fallback)
  external: {
    host: process.env.DB_HOST_EXTERNAL || 'localhost',
    port: parseInt(process.env.DB_PORT_EXTERNAL) || 3306,
    user: process.env.DB_USER || 'yapee_user',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'yapee_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
    timezone: process.env.DB_TIMEZONE || '+08:00',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  },

  // Network Information
  network: {
    vpc: process.env.VPC_NETWORK || 'vpc-t4nmy4krub66fs7v9v5ai',
    cidr: process.env.VPC_CIDR || '172.16.0.0/12',
    proxyEnabled: process.env.DATABASE_PROXY_ENABLED === 'true',
    region: 'singapore'
  },

  // Connection Test Query
  testQuery: 'SELECT VERSION() as version, NOW() as current_time'
};

export default cloudDbConfig;
