module.exports = Stack;

function Stack(layers) {
    this.layers = layers || [];
}

Stack.prototype.use = function(layer) {
    this.layers.push(layer);
    return this;
};

Stack.prototype.handle = function(context) {
    var self = this;
    var index = 0;

    function next(err) {
        var layer = self.layers[index++];

        if (!layer) {
            // Reached bottom of stack
            if (err) throw err;
            return;
        }

        var exec = function(args) {
            try {
                layer.apply(context || {}, args);
            } catch (err) {
                next(err);
            }
        };

        if (err) {
            if (layer.length === 2) {
                // Layer accepts the error
                exec([err, next]);
            } else {
                // Pass error down the stack
                next(err);
            }
        } else {
            exec([next]);
        }
    };

    next();
};