#!/bin/bash
set -xe

# Start PM2, the application server.
pm2_path=$(su - ubuntu -c 'which pm2')
if [ -n "$pm2_path" ]; then
  su - ubuntu -c 'cd /var/www/platform-api-nestjs && pm2 start ecosystem.config.js --only platform-api-nestjs'
fi