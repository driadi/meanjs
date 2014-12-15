if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development';
}

var config = require('./env/' + process.env.NODE_ENV) || {};

module.exports = config;