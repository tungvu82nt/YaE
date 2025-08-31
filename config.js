// ===========================================
// Yapee E-commerce Configuration
// ===========================================

module.exports = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'yapee_user',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'yapee_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },

  // Application Configuration
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  },

  // JWT Configuration (for future use)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expire: process.env.JWT_EXPIRE || '7d'
  },

  // File Upload Configuration
  upload: {
    path: process.env.UPLOAD_PATH || 'uploads/',
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880
  },

  // Email Configuration (for future use)
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password'
    }
  },

  // Redis Configuration (for future use)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  },

  // External APIs (for future use)
  apis: {
    googleMaps: process.env.GOOGLE_MAPS_API_KEY || '',
    paymentGateway: process.env.PAYMENT_GATEWAY_KEY || ''
  }
};
