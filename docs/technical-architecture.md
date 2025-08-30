# Yapee Technical Architecture

## Kiến trúc tổng quan

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│                Browser                  │
├─────────────────────────────────────────┤
│           React Application             │
│  ┌─────────────┬─────────────────────┐  │
│  │   User UI   │    Admin Panel      │  │
│  └─────────────┴─────────────────────┘  │
├─────────────────────────────────────────┤
│         State Management                │
│    (Context API + useReducer)           │
├─────────────────────────────────────────┤
│           API Layer                     │
│      (Supabase Client)                  │
└─────────────────────────────────────────┘
```

### Backend Architecture (Version 2+)
```
┌─────────────────────────────────────────┐
│              Supabase                   │
├─────────────────────────────────────────┤
│  ┌─────────────┬─────────────────────┐  │
│  │ PostgreSQL  │   Edge Functions    │  │
│  │ Database    │   (Serverless)      │  │
│  └─────────────┴─────────────────────┘  │
├─────────────────────────────────────────┤
│  ┌─────────────┬─────────────────────┐  │
│  │    Auth     │    File Storage     │  │
│  │   Service   │    (Images/Docs)    │  │
│  └─────────────┴─────────────────────┘  │
├─────────────────────────────────────────┤
│           Real-time Engine              │
│        (WebSocket Subscriptions)        │
└─────────────────────────────────────────┘
```

## Database Schema (Version 2)

### Core Tables
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  seller_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(12,2) NOT NULL,
  shipping_fee DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images JSONB DEFAULT '[]',
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Design

### RESTful Endpoints
```
GET    /api/products              # List products with filters
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product (admin/seller)
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product

GET    /api/categories            # List categories
POST   /api/categories            # Create category (admin)

GET    /api/orders                # List user orders
POST   /api/orders                # Create new order
GET    /api/orders/:id            # Get order details
PUT    /api/orders/:id/status     # Update order status

GET    /api/reviews/:productId    # Get product reviews
POST   /api/reviews               # Create review
PUT    /api/reviews/:id           # Update review

POST   /api/cart/add              # Add to cart
GET    /api/cart                  # Get cart items
PUT    /api/cart/:id              # Update cart item
DELETE /api/cart/:id              # Remove from cart

POST   /api/auth/login            # User login
POST   /api/auth/register         # User registration
POST   /api/auth/logout           # User logout
GET    /api/auth/profile          # Get user profile
```

### GraphQL Schema (Version 3)
```graphql
type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  originalPrice: Float
  category: Category!
  brand: String
  images: [String!]!
  specifications: JSON
  rating: Float
  reviewCount: Int
  stock: Int
  sold: Int
  tags: [String!]
  reviews(first: Int, after: String): ReviewConnection
  recommendations: [Product!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type User {
  id: ID!
  email: String!
  name: String
  avatar: String
  role: UserRole!
  orders(first: Int, after: String): OrderConnection
  reviews(first: Int, after: String): ReviewConnection
  wishlist: [Product!]
  createdAt: DateTime!
}

type Query {
  products(
    first: Int
    after: String
    category: String
    search: String
    filters: ProductFilters
  ): ProductConnection
  
  product(id: ID!): Product
  recommendations(userId: ID!, limit: Int): [Product!]
  searchSuggestions(query: String!): [String!]
}

type Mutation {
  addToCart(productId: ID!, quantity: Int!): CartItem
  createOrder(input: CreateOrderInput!): Order
  createReview(input: CreateReviewInput!): Review
  updateProfile(input: UpdateProfileInput!): User
}

type Subscription {
  orderStatusUpdated(orderId: ID!): Order
  newNotification(userId: ID!): Notification
  priceAlert(productId: ID!): Product
}
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────────────────────────────┐
│            Frontend App                 │
├─────────────────────────────────────────┤
│              JWT Token                  │
│         (Stored in httpOnly)            │
├─────────────────────────────────────────┤
│           Supabase Auth                 │
│    ┌─────────────────────────────────┐  │
│    │  Row Level Security (RLS)       │  │
│    │  - Users can only see own data  │  │
│    │  - Admins have elevated access  │  │
│    │  - Sellers see own products     │  │
│    └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Data Protection
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **PII Protection**: Personal data anonymization
- **GDPR Compliance**: Data deletion và export rights

## Performance Optimization

### Frontend Optimization
```typescript
// Code splitting
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ProductModal = lazy(() => import('./components/ProductModal'));

// Image optimization
const OptimizedImage = ({ src, alt, ...props }) => (
  <img
    src={`${src}?w=400&h=400&fit=crop&auto=format`}
    srcSet={`
      ${src}?w=200&h=200&fit=crop&auto=format 200w,
      ${src}?w=400&h=400&fit=crop&auto=format 400w,
      ${src}?w=800&h=800&fit=crop&auto=format 800w
    `}
    sizes="(max-width: 768px) 200px, 400px"
    loading="lazy"
    alt={alt}
    {...props}
  />
);

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';
```

### Backend Optimization
- **Database Indexing**: Optimized queries với composite indexes
- **Caching Strategy**: Redis cho frequently accessed data
- **CDN Integration**: Global content delivery
- **Database Connection Pooling**: Efficient connection management

## Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Google Analytics 4
- **Custom Events**: Business-specific metrics

### Infrastructure Monitoring
- **Uptime Monitoring**: 99.9% SLA tracking
- **Database Performance**: Query optimization alerts
- **API Response Times**: <100ms target
- **Resource Usage**: CPU, memory, storage monitoring

## Deployment Strategy

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Yapee
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build application
        run: npm run build
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: npm run deploy
```

### Environment Strategy
- **Development**: Local development với hot reload
- **Staging**: Production-like environment cho testing
- **Production**: Live environment với monitoring
- **Disaster Recovery**: Automated backups và failover

## Scalability Planning

### Horizontal Scaling
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Partition data by region/category
- **Microservices**: Break down monolith (Version 4+)
- **CDN Strategy**: Global content distribution

### Performance Targets
- **Concurrent Users**: 10,000+ simultaneous users
- **Database Queries**: <50ms average response
- **File Uploads**: <5 seconds for images
- **Search Results**: <200ms response time