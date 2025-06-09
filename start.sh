#!/bin/bash

# Startup script for production deployment
echo "🚀 Starting Hotel Flask App..."

# Check if running in production
if [ "$FLASK_ENV" = "production" ]; then
    echo "✅ Production environment detected"
    
    # Check environment variables
    if [ -z "$GCP_CREDENTIALS_JSON" ] && [ ! -f "gcp_credentials.json" ]; then
        echo "⚠️  Warning: No Google credentials found"
    else
        echo "✅ Google credentials found"
    fi
    
    if [ -z "$DEFAULT_SHEET_ID" ]; then
        echo "❌ Error: DEFAULT_SHEET_ID not set"
        exit 1
    fi
    
    echo "✅ Environment variables validated"
fi

# Start the application
echo "🚀 Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:${PORT:-8080} \
    --workers 2 \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    app:app
