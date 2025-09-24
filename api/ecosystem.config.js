{
  "apps": [
    {
      "name": "ota24hours-api",
      "script": "dist/index.js",
      "cwd": "/var/www/api.ota24hours",
      "env": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "instances": "max",
      "exec_mode": "cluster",
      "max_memory_restart": "1G",
      "merge_logs": true,
      "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
  ]
}