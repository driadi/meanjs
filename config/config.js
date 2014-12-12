var config = require('./env/' + process.env.NODE_ENV) || {};

module.exports = config;