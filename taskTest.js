#!/usr/bin/node

var tasker = require('./tasker.js').Tasker;

var t = new tasker();
t.registerTask('test', function(d) {
    console.log('test function');
});

t.registerTask('test2', function(d) {
    console.log('test2 function');
});

t.registerTask('test3', function(d) {
    console.log('test3 function');
});

module.exports.testTasks = t;
