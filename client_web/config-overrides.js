const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = function override(config, env) {
    config.plugins.push(new webpack.DefinePlugin({
        'process.env.BASEURL': JSON.stringify(process.env.BASEURL),
        'process.env.BASEURL_CRON': JSON.stringify(process.env.BASEURL_CRON)
    }));

    return config;
};