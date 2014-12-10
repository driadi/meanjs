'use strict';

/**
 * Generates default error object
 */
module.exports.generateError = function (msg, err) {
    return {
        error: {
            message: msg,
            childEx: err
        }
    };
};