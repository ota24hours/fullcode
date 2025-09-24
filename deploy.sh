#!/bin/bash

# OTA24Hours Deployment Script
# Run this script to deploy/update your applications

set -e

# Configuration
REPO_BACKEND="YOUR_BACKEND_REPO_URL"
REPO_FRONTEND="YOUR_FRONTEND_REPO_URL"  
REPO_ADMIN="YOUR_ADMIN_REPO_URL"

APP_DIR="/var/www/ota24hours"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
ADMIN_DIR="$APP_DIR/admin"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to deploy backend
deploy_backend() {
    print_status "🚀 Deploying Backend..."
    
    cd $BACKEND_DIR
    
    # Pull latest changes
    if [ -d ".git" ]; then
        git pull origin main
    else
        print_warning "Not a git repository. Skipping git pull."
    fi
    
    # Install dependencies
    npm install --production
    
    # Build if necessary
    if [ -f "tsconfig.json" ]; then
        npm run build 2>/dev/null || print_warning "No build script found"
    fi
    
    # Restart PM2 process
    pm2 reload ota-backend 2>/dev/null || pm2 start ecosystem.config.js
    
    print_status "✅ Backend deployment completed"
}

# Function to deploy frontend
deploy_frontend() {
    print_status "🚀 Deploying Frontend..."
    
    cd $FRONTEND_DIR
    
    # Pull latest changes
    if [ -d ".git" ]; then
        git pull origin main
    else
        print_warning "Not a git repository. Skipping git pull."
    fi
    
    # Install dependencies
    npm install --legacy-peer-deps
    
    # Build for production
    npm run build
    
    print_status "✅ Frontend deployment completed"
}

# Function to deploy admin
deploy_admin() {
    print_status "🚀 Deploying Admin Panel..."
    
    cd $ADMIN_DIR
    
    # Pull latest changes
    if [ -d ".git" ]; then
        git pull origin main
    else
        print_warning "Not a git repository. Skipping git pull."
    fi
    
    # Install dependencies
    npm install --legacy-peer-deps
    
    # Build for production
    npm run build
    
    print_status "✅ Admin deployment completed"
}

# Function to restart services
restart_services() {
    print_status "🔄 Restarting services..."
    
    # Reload Nginx
    sudo systemctl reload nginx
    
    # Restart PM2 if needed
    pm2 restart ota-backend 2>/dev/null || print_warning "PM2 process not found"
    
    print_status "✅ Services restarted"
}

# Function to run health check
health_check() {
    print_status "🏥 Running health check..."
    
    if [ -f "$APP_DIR/healthcheck.sh" ]; then
        bash $APP_DIR/healthcheck.sh
    else
        print_warning "Health check script not found"
    fi
}

# Main deployment function
main() {
    echo "🚀 Starting OTA24Hours Deployment"
    echo "=================================="
    
    # Check if directories exist
    if [ ! -d "$APP_DIR" ]; then
        print_error "Application directory not found: $APP_DIR"
        exit 1
    fi
    
    # Parse command line arguments
    case "${1:-all}" in
        "backend")
            deploy_backend
            restart_services
            ;;
        "frontend")
            deploy_frontend
            restart_services
            ;;
        "admin")
            deploy_admin
            restart_services
            ;;
        "all")
            deploy_backend
            deploy_frontend
            deploy_admin
            restart_services
            ;;
        "health")
            health_check
            exit 0
            ;;
        *)
            echo "Usage: $0 [backend|frontend|admin|all|health]"
            echo "  backend  - Deploy only backend"
            echo "  frontend - Deploy only frontend"
            echo "  admin    - Deploy only admin"
            echo "  all      - Deploy all applications (default)"
            echo "  health   - Run health check only"
            exit 1
            ;;
    esac
    
    print_status "🎉 Deployment completed successfully!"
    
    # Run health check
    health_check
}

# Run main function with all arguments
main "$@"