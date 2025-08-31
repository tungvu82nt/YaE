# 🚀 YA PEE E-COMMERCE PLATFORM - PRODUCTION DEPLOYMENT GUIDE

## 📋 Deployment Overview

This guide provides comprehensive instructions for deploying the YA PEE E-commerce platform to production with enterprise-grade infrastructure, monitoring, and security.

### 🎯 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Traefik       │    │   Frontend      │    │   Backend API   │
│   (Reverse      │◄──►│   (React)       │◄──►│   (Node.js)     │
│    Proxy)       │    │                 │    │                 │
│   Port: 80/443  │    │   Port: 80      │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   MySQL         │    │   Redis         │
                    │   Database      │    │   Cache         │
                    │   Port: 3306    │    │   Port: 6379    │
                    └─────────────────┘    └─────────────────┘
```

## 🛠️ Prerequisites

### System Requirements
- **Ubuntu 20.04+** or **CentOS 7+**
- **4GB RAM minimum** (8GB recommended)
- **50GB storage** (SSD recommended)
- **Docker & Docker Compose**
- **Domain name** with DNS access

### Network Requirements
- **Ports 80, 443** for web traffic
- **Port 22** for SSH access
- **Port 3306** for MySQL (internal)
- **Port 6379** for Redis (internal)

## 📦 Step-by-Step Deployment

### Step 1: Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git htop ncdu ufw fail2ban

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### Step 2: Clone Repository

```bash
# Clone the application
git clone https://github.com/your-org/yapee-ecommerce.git
cd yapee-ecommerce

# Create production directory
mkdir -p production
cd production
```

### Step 3: Environment Configuration

```bash
# Copy production configuration files
cp ../docker-compose.prod.yml ./docker-compose.yml
cp ../config/production.env ./.env
cp ../nginx.conf ./nginx.prod.conf

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Database
MYSQL_ROOT_PASSWORD=your_mysql_root_password
DB_USER=yapee_user
DB_PASSWORD=your_db_password
DB_NAME=yapee_db

# JWT
JWT_SECRET=your_jwt_secret_key

# Redis
REDIS_PASSWORD=your_redis_password

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SSL (Let's Encrypt)
SSL_EMAIL=admin@yapee.com

# Monitoring
GRAFANA_PASSWORD=your_grafana_password
SENTRY_DSN=your_sentry_dsn

# Domain
DOMAIN=yapee.com
```

### Step 4: SSL Certificate Setup

```bash
# Make SSL setup script executable
chmod +x ../scripts/setup-ssl.sh

# Run SSL setup (requires domain DNS to point to server)
sudo ../scripts/setup-ssl.sh
```

### Step 5: Database Initialization

```bash
# Create MySQL initialization scripts
mkdir -p mysql-init

# Copy schema and data files
cp ../mysql-schema.sql ./mysql-init/01-schema.sql
cp ../scripts/seed-data.sql ./mysql-init/02-seed.sql
```

### Step 6: Deploy Application

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 7: Verify Deployment

```bash
# Run deployment verification
chmod +x ../scripts/verify-deployment.sh
../scripts/verify-deployment.sh
```

## 🔧 Configuration Files

### Docker Compose Production (`docker-compose.prod.yml`)
- **Frontend**: React app with Nginx
- **Backend**: Node.js API server
- **Database**: MySQL 8.0 with persistent storage
- **Cache**: Redis for session and data caching
- **Reverse Proxy**: Traefik with automatic SSL
- **Monitoring**: Prometheus + Grafana + Loki

### Environment Configuration (`.env`)
Complete production environment variables for all services.

### Nginx Configuration (`nginx.conf`)
- **SSL/TLS termination**
- **Gzip compression**
- **Rate limiting**
- **Security headers**
- **Caching rules**
- **API proxying**

## 📊 Monitoring & Observability

### Included Monitoring Stack:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboard
- **Loki**: Log aggregation
- **Promtail**: Log shipping
- **Traefik**: Reverse proxy with metrics

### Access URLs:
- **Application**: https://yapee.com
- **API**: https://api.yapee.com
- **Grafana**: https://grafana.yapee.com
- **Prometheus**: https://prometheus.yapee.com
- **Traefik Dashboard**: https://traefik.yapee.com

## 🔒 Security Configuration

### SSL/TLS Setup
- Automatic SSL certificates via Let's Encrypt
- TLS 1.2/1.3 support
- HSTS headers
- Certificate auto-renewal

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Database Security
- Non-root database user
- Password authentication
- Network isolation
- Regular backups

## 💾 Backup & Recovery

### Automated Backup Schedule
```bash
# Daily backup at 2 AM
0 2 * * * /app/scripts/backup.sh
```

### Backup Locations
- **Local**: `/app/backups/` (30 days retention)
- **Remote**: AWS S3 / Google Cloud Storage (optional)

### Recovery Process
```bash
# Stop application
docker-compose down

# Restore database
gunzip < backup_file.sql.gz | mysql -u yapee_user -p yapee_db

# Restart application
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Kill conflicting processes
sudo kill -9 <PID>
```

#### 2. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Reload nginx
sudo nginx -s reload
```

#### 3. Database Connection Issues
```bash
# Check MySQL container logs
docker-compose logs mysql-prod

# Test database connection
docker-compose exec mysql-prod mysql -u yapee_user -p yapee_db
```

#### 4. Memory Issues
```bash
# Check container resource usage
docker stats

# Adjust Docker memory limits
echo '{"memory": "2g", "cpu_quota": 100000}' > /etc/docker/daemon.json
sudo systemctl restart docker
```

## 📈 Performance Optimization

### Frontend Optimization
- **Code splitting** with dynamic imports
- **Asset optimization** with compression
- **CDN integration** for static assets
- **Service worker** for caching

### Backend Optimization
- **Connection pooling** for database
- **Redis caching** for frequent queries
- **Rate limiting** for API endpoints
- **Compression** for responses

### Database Optimization
- **Indexing** for common queries
- **Query optimization**
- **Connection limits**
- **Regular maintenance**

## 🔄 Maintenance Tasks

### Daily Tasks
- ✅ Monitor system resources
- ✅ Check application logs
- ✅ Verify SSL certificate expiry
- ✅ Review error rates

### Weekly Tasks
- ✅ Update Docker images
- ✅ Review performance metrics
- ✅ Clean up old logs
- ✅ Test backup restoration

### Monthly Tasks
- ✅ Security updates
- ✅ Database optimization
- ✅ Performance tuning
- ✅ User feedback review

## 📞 Support & Monitoring

### Health Check Endpoints
- **Application**: `https://yapee.com/health`
- **API**: `https://api.yapee.com/health`
- **Database**: `https://api.yapee.com/health/db`

### Log Locations
- **Application**: `/var/log/nginx/`
- **Database**: `docker-compose logs mysql-prod`
- **Redis**: `docker-compose logs redis-prod`

### Monitoring Dashboards
- **Grafana**: https://grafana.yapee.com
- **Prometheus**: https://prometheus.yapee.com
- **Traefik**: https://traefik.yapee.com

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Domain DNS configured
- [ ] SSL certificates obtained
- [ ] Environment variables set
- [ ] Database schema prepared
- [ ] Backup strategy defined

### Deployment
- [ ] Docker containers running
- [ ] Services accessible
- [ ] Database connections working
- [ ] SSL certificates valid
- [ ] Monitoring operational

### Post-Deployment
- [ ] Application functionality tested
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Backup verification done
- [ ] Documentation updated

## 🚀 Next Steps

1. **Go-Live**: Application is ready for production traffic
2. **Monitoring**: Set up alerts for critical metrics
3. **Scaling**: Configure auto-scaling based on traffic
4. **CDN**: Integrate CDN for global performance
5. **Analytics**: Set up detailed user analytics

---

## 📞 Emergency Contacts

- **Technical Lead**: [Your Name] - [Your Email]
- **DevOps Team**: [Team Email]
- **Infrastructure Provider**: [Provider Support]

## 📚 Additional Resources

- [Application Documentation](./README.md)
- [API Documentation](./docs/api/)
- [Troubleshooting Guide](./docs/troubleshooting.md)
- [Security Guidelines](./docs/security.md)

---

**🎉 YA PEE E-commerce Platform is now ready for production deployment!**

*Last updated: January 2024*
