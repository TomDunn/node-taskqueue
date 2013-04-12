#!/usr/bin/node

var task = require('./taskTest.js').testTasks;

function res(e,v) {
    console.log(v);
}

for (var i = 0; i < 3; i++) {
    task.tasks.test.delayed({m:'n'});
    task.tasks.test2.delayed({m:'n'}, res);
    task.tasks.test3.delayed({m:'n'}, res);
}

console.log('done...');
//task.client.quit();
