module.exports = {
  apps: [{
    name: 'ota-backend',
    script: 'index.js',
    cwd: '/var/www/ota24hours/backend',
    
    // Instances and execution mode
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Logging
    error_file: '/var/log/ota24hours/backend-error.log',
    out_file: '/var/log/ota24hours/backend-out.log',
    log_file: '/var/log/ota24hours/backend.log',
    time: true,
    
    // Memory and performance
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Restart policies
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Monitoring
    watch: false, // Set to true for development
    ignore_watch: [
      'node_modules',
      'logs',
      'uploads',
      '.git'
    ],
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    
    // Advanced PM2 features
    instance_var: 'INSTANCE_ID',
    combine_logs: true,
    merge_logs: true,
    
    // Kill timeout
    kill_timeout: 1600,
    listen_timeout: 3000,
    
    // Source map support
    source_map_support: true,
    
    // Environment-specific configurations
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000,
      watch: true
    },
    
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 5000
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deployer',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/ota-backend.git',
      path: '/var/www/ota24hours/backend',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
};