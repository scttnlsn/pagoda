pagoda
===

Reusable function stacks.

Example
---

    var pagoda = require('pagoda');

    var stack = pagoda.stack(
        function(next) {
            console.log(this.foo);
            this.bar = 'baz';
            next();
        },
        function(next) {
            console.log(this.bar);
            next();
        }
    );

    stack.handle({ foo: 'bar' });

Usage
---
Stacks execute an ordered list of functions.  To register functions with a stack, you can pass them as arguments to `pagoda.stack` and/or append a function to the bottom of the stack by calling `use`:

    var stack = pagoda.stack(
        function(next) {
            // first
        },
        function(next) {
            // second
        },
        …
    );
    
    stack.use(function(next) {
        // third
    });
    
Each function must accept an argument that, when called, will pass control down to the next function in the stack.

Execute a stack by calling `handle` and passing an optional context that will be bound to `this` in all of the functions:

    stack.handle(context);

### Errors ###

Errors can be sent down the stack by passing them to `next`:

    function(next) {
        next(new Error());
    }
    
Functions can optionally handle these errors by accepting an additional argument:

    function(err, next) {
        if (err) console.log(err.message);
        next();
    }
    
Functions that do not accept an error argument will be skipped when an error propagates down the stack.  If an error reaches the bottom of the stack it will be thrown.

Install
---

    npm install pagoda

Tests
---

    make test