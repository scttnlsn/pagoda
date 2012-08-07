(function() {

    var pagoda = {};

    var root = this;
    var orig = root.pagoda;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = pagoda;
    } else {
        root.pagoda = pagoda;
    }

    pagoda.noConflict = function () {
        root.pagoda = orig;
        return pagoda;
    };

    pagoda.stack = function() {
        var layers = [].slice.call(arguments);
        return new Stack(layers);
    };

    pagoda.Stack = Stack;

    // Stack
    // ---------------

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

})();