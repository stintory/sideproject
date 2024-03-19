module.exports = {
  apps: [
    {
      name: 'platform-api-nestjs',
      script: './main.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      instance_var: 'INSTANCE_ID',
    },
  ],
};
