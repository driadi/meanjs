'use strict';
var path = require('path');
module.exports.index = function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
};