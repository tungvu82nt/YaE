#!/usr/bin/env node

// ===========================================
// YA PEE E-COMMERCE PRODUCTION WEB SERVER
// Enterprise-grade Node.js/Express server
// ===========================================

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer } from 'http'
import winston from 'winston'
import 'dotenv/config'

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Environment configuration
let isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3001

// Force production mode if running with start:prod or NODE_ENV=production
if (process.argv.includes('start:prod') || process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION === 'true') {
  isProduction = true
  process.env.NODE_ENV = 'production'
}

// Logger configuration
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'yapee-web-server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    ...(isProduction ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
      }),
      new winston.transports.File({
        filename: 'logs/combined.log'
      })
    ] : [])
  ]
})

// Debug logging
logger.info(`Environment: ${process.env.NODE_ENV}`)
logger.info(`Is Production: ${isProduction}`)
logger.info(`Port: ${PORT}`)

// Create Express application
const app = express()
const server = createServer(app)

// ===========================================
// MIDDLEWARE CONFIGURATION
// ===========================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.yapee.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(cors({
  origin: isProduction
    ? ['https://yapee.com', 'https://www.yapee.com']
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    })
  }
})

app.use('/api/', limiter)

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))

// Logging middleware
app.use(morgan(isProduction ? 'combined' : 'dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ===========================================
// ROUTES
// ===========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API healthy',
    timestamp: new Date().toISOString(),
    database: 'connected', // TODO: Add actual DB health check
    cache: 'connected'     // TODO: Add actual cache health check
  })
})

// Products API - Use mock data for now
app.get('/api/products', (req, res) => {
  try {
    const filters = req.query;
    console.log('Products request with filters:', filters);

    // Return mock data for now
    const mockProducts = [
      {
        id: '1',
        name: 'iPhone 15 Pro Max 256GB',
        price: 34990000,
        originalPrice: 36990000,
        discount: 5,
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
        description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP',
        category: 'dien-thoai',
        brand: 'Apple',
        rating: 4.8,
        reviewCount: 2847,
        sold: 1250,
        stock: 50,
        tags: ['hot', 'new'],
        specifications: {
          'Màn hình': '6.7 inch Super Retina XDR',
          'Camera': '48MP + 12MP + 12MP',
          'Chip': 'A17 Pro',
          'RAM': '8GB',
          'Bộ nhớ': '256GB'
        }
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra 512GB',
        price: 31990000,
        originalPrice: 33990000,
        discount: 6,
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
        images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg'],
        description: 'Galaxy S24 Ultra với S Pen tích hợp',
        category: 'dien-thoai',
        brand: 'Samsung',
        rating: 4.7,
        reviewCount: 1893,
        sold: 890,
        stock: 35,
        tags: ['hot'],
        specifications: {
          'Màn hình': '6.8 inch Dynamic AMOLED 2X',
          'Camera': '200MP + 50MP + 12MP + 10MP',
          'Chip': 'Snapdragon 8 Gen 3',
          'RAM': '12GB',
          'Bộ nhớ': '512GB'
        }
      }
    ];

    res.json(mockProducts);
  } catch (error) {
    console.error('API Error - GET /api/products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('Product request for ID:', id);

    // Return mock product for now
    const mockProduct = {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      price: 34990000,
      originalPrice: 36990000,
      discount: 5,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
      description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP',
      category: 'dien-thoai',
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 2847,
      sold: 1250,
      stock: 50,
      tags: ['hot', 'new'],
      specifications: {
        'Màn hình': '6.7 inch Super Retina XDR',
        'Camera': '48MP + 12MP + 12MP',
        'Chip': 'A17 Pro',
        'RAM': '8GB',
        'Bộ nhớ': '256GB'
      }
    };

    res.json(mockProduct);
  } catch (error) {
    console.error('API Error - GET /api/products/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Categories API
app.get('/api/categories', (req, res) => {
  try {
    const mockCategories = [
      { id: '1', name: 'Điện Thoại - Máy Tính Bảng', icon: 'Smartphone', slug: 'dien-thoai' },
      { id: '2', name: 'Điện Tử', icon: 'Laptop', slug: 'dien-tu' },
      { id: '3', name: 'Thời Trang Nam', icon: 'ShirtIcon', slug: 'thoi-trang-nam' },
      { id: '4', name: 'Thời Trang Nữ', icon: 'Shirt', slug: 'thoi-trang-nu' },
      { id: '5', name: 'Mẹ & Bé', icon: 'Baby', slug: 'me-be' },
      { id: '6', name: 'Nhà Cửa & Đời Sống', icon: 'Home', slug: 'nha-cua' },
      { id: '7', name: 'Sách & Tiểu Thuyết', icon: 'Book', slug: 'sach' },
      { id: '8', name: 'Thể Thao & Du Lịch', icon: 'Bike', slug: 'the-thao' }
    ];

    res.json(mockCategories);
  } catch (error) {
    console.error('API Error - GET /api/categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auth API
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
      const adminUser = {
        id: 'admin1',
        username: 'admin',
        email: 'admin@yapee.vn',
        name: 'Admin Yapee',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      return res.json(adminUser);
    }

    // Mock regular user
    const mockUser = {
      id: '1',
      username: username,
      email: `${username}@yapee.vn`,
      name: 'Nguyễn Văn A',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    res.json(mockUser);
  } catch (error) {
    console.error('API Error - POST /api/auth/login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const userData = req.body;
    console.log('Registration attempt:', userData);

    const newUser = {
      id: `user_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      name: userData.fullName,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    res.status(201).json(newUser);
  } catch (error) {
    console.error('API Error - POST /api/auth/register:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders API
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    console.log('Order creation:', orderData);

    const mockOrder = {
      id: `order_${Date.now()}`,
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress
    };

    res.status(201).json(mockOrder);
  } catch (error) {
    console.error('API Error - POST /api/orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Get orders for user:', userId);

    const mockOrders = [
      {
        id: 'order_123',
        userId: userId,
        items: [],
        total: 34990000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: {}
      }
    ];

    res.json(mockOrders);
  } catch (error) {
    console.error('API Error - GET /api/orders/user/:userId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Static file serving for production
if (isProduction) {
  const distPath = join(__dirname, '../dist')

  // Serve static files with caching
  app.use(express.static(distPath, {
    maxAge: '1y',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache')
      }
    }
  }))

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(join(distPath, 'index.html'))
    }
  })
}

// Development proxy to Vite dev server
if (!isProduction) {
  try {
    const { createProxyMiddleware } = await import('http-proxy-middleware')

    app.use('/', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
      ws: true,
      logLevel: 'silent',
      onError: (err, req, res) => {
        logger.warn(`Proxy error for ${req.url}: ${err.message}`)
        res.status(503).json({
          error: 'Development server not available',
          message: 'Please start the Vite dev server with: npm run dev'
        })
      },
      onProxyReq: (proxyReq, req) => {
        logger.debug(`Proxying ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}${proxyReq.path}`)
      }
    }))
  } catch (error) {
    logger.error('Failed to setup proxy middleware:', error)
    app.use('/', (req, res) => {
      res.status(503).json({
        error: 'Proxy setup failed',
        message: 'Development proxy middleware could not be initialized'
      })
    })
  }
}

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`)
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  })
})

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Don't leak error details in production
  const errorResponse = isProduction
    ? { error: 'Internal server error' }
    : {
        error: error.message,
        stack: error.stack,
        url: req.url,
        timestamp: new Date().toISOString()
      }

  res.status(500).json(errorResponse)
})

// ===========================================
// SERVER STARTUP
// ===========================================

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`)

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err)
      process.exit(1)
    }

    logger.info('Server closed successfully')
    process.exit(0)
  })

  // Force close server after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

// Start server
server.listen(PORT, () => {
  const startupMessage = `
🚀 YA PEE E-commerce Web Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}
🌐 Server URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📈 API Health: http://localhost:${PORT}/api/health

${isProduction ?
`✅ Production Features:
   • Security headers enabled
   • Rate limiting active
   • Compression enabled
   • Static file serving
   • SPA fallback configured`
:
`🔧 Development Features:
   • Hot reload enabled
   • Proxy to Vite dev server
   • Debug logging active`
}

📝 Server Information:
   • Node.js Version: ${process.version}
   • Platform: ${process.platform}
   • Architecture: ${process.arch}
   • Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB used
   • Uptime: ${Math.round(process.uptime())}s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `

  console.log(startupMessage)
  logger.info(`YA PEE Web Server started on port ${PORT}`)
})

// Export for testing
export default app
