#!/usr/bin/node

var tasker = require('./tasker.js').Tasker;

var t = new tasker();
t.registerTask('test', function(data, done) {
    console.log('test function');
    done('', 'zero');
});

t.registerTask('test2', function(data, done) {
    console.log('test2 function');
    done('', 'two');
});

t.registerTask('test3', function(data, done) {
    console.log('test3 function');
    done('', 'three');
});

module.exports.testTasks = t;
