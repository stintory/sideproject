#!/bin/bash
set -xe

# Check if the deployment directory does not exist
proj_dir="/var/www/platform-api-nestjs"
if [ ! -d "$proj_dir" ]; then
  mkdir -p "$proj_dir"
  chown ubuntu:ubuntu "$proj_dir"
fi

su - ubuntu -c 'nvm install lts/hydrogen'
su - ubuntu -c 'nvm use lts/hydrogen'
su - ubuntu -c 'npm install pm2@latest -g'
