#!/bin/bash
set -x

# Stop PM2, the application server.
pm2_path=$(su - ubuntu -c 'which pm2')
if [ -n "$pm2_path" ]; then
  app_pid=$(su - ubuntu -c 'pm2 pid boilerplate')
  if [ -n "$app_pid" ]; then
    su - ubuntu -c 'cd /var/www/boilerplate && pm2 stop ecosystem.config.js --only boilerplate'
  fi
fi