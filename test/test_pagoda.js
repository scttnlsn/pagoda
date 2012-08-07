var assert = require('assert');
var pagoda = require('../pagoda');

describe('Stack', function() {
    var stack;

    beforeEach(function() {
        stack = pagoda.stack();
    });

    describe('when adding function', function() {
        it('returns stack', function() {
            var result = stack.use(function() {});
            assert.equal(result, stack);
        });
    });

    describe('when handling', function() {
        it('calls first layer', function(done) {
            stack.use(function() {
                done();
            });

            stack.handle();
        });

        it('control can be passed to next layer', function(done) {
            stack.use(function(next) {
                next();
            });

            stack.use(function() {
                done();
            });

            stack.handle();
        });

        it('passes errors to accepting layers', function(done) {
            stack.use(function(next) {
                next(new Error());
            });

            stack.use(function(err, next) {
                assert.ok(err);
                assert.ok(err instanceof Error);
                done();
            });

            stack.handle();
        });

        it('catches errors thrown in layer', function(done) {
            stack.use(function() {
                throw new Error();
            });

            stack.use(function(err, next) {
                assert.ok(err);
                assert.ok(err instanceof Error);
                done();
            });

            stack.handle();
        });

        it('throws unhandled errors', function() {
            stack.use(function() {
                throw new Error();
            });

            assert.throws(function() {
                stack.handle();
            });
        });

        it('handles layers in given context', function(done) {
            stack.use(function() {
                assert.equal(this.foo, 'bar');
                assert.equal(this.baz, 'qux');
                done();
            });

            stack.handle({ foo: 'bar', baz: 'qux' });
        });
    });
});