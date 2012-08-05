var Stack = require('./stack');

exports.stack = function() {
    var layers = [].slice.call(arguments);
    return new Stack(layers);
};