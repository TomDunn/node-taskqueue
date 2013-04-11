#!/usr/bin/node

var task = require('./taskTest.js').testTasks;

for (var i = 0; i < 100; i++) {
    task.tasks.test.delayed({m:'n'});
    task.tasks.test2.delayed({m:'n'});
    task.tasks.test3.delayed({m:'n'});
}
