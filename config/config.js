const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'stage' || env === 'prod') {
    process.env.NODE_ENV = env;
    const config = require('./config.json');
    const envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
