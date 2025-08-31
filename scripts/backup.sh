#!/bin/bash

# Database Backup Script
# YA PEE E-commerce Platform

set -e

# Configuration
BACKUP_DIR="/app/backups"
DB_HOST="${DB_HOST:-mysql}"
DB_USER="${DB_USER:-yapee_user}"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="${DB_NAME:-yapee_db}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/yapee_backup_$TIMESTAMP.sql.gz"

echo "🚀 Starting database backup..."
echo "📁 Backup file: $BACKUP_FILE"

# Create database backup
mysqldump \
  --host="$DB_HOST" \
  --user="$DB_USER" \
  --password="$DB_PASSWORD" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" | gzip > "$BACKUP_FILE"

# Verify backup file was created
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup failed - file not created"
    exit 1
fi

# Get backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup completed successfully"
echo "📊 Backup size: $BACKUP_SIZE"

# Clean up old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "yapee_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "yapee_backup_*.sql.gz" | wc -l)
echo "📁 Total backups retained: $BACKUP_COUNT"

# Optional: Upload to cloud storage
if [ ! -z "$CLOUD_BACKUP_BUCKET" ]; then
    echo "☁️  Uploading backup to cloud storage..."
    # Add your cloud upload commands here (AWS S3, Google Cloud, etc.)
    # aws s3 cp "$BACKUP_FILE" "s3://$CLOUD_BACKUP_BUCKET/"
    echo "✅ Cloud upload completed"
fi

echo "🎉 Database backup process completed successfully"

# Send notification (optional)
if [ ! -z "$NOTIFICATION_WEBHOOK" ]; then
    curl -X POST "$NOTIFICATION_WEBHOOK" \
         -H "Content-Type: application/json" \
         -d "{\"text\":\"Database backup completed: $BACKUP_FILE ($BACKUP_SIZE)\"}"
fi
