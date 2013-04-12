#!/usr/bin/env node

var testTasks   = require('./testTasks.js').testTasks;

function logIt(err, res) {
    console.log(res);
}    

/* Because we pass a callback, the callback will be
 * called with the result of our workers' work.
 * the delayed.add means that the task is pushed
 * to redis for distribution to workers
 */
testTasks.tasks.add.delayed({first:1,second:2}, logIt);
testTasks.tasks.add.delayed({first:2,second:3}, logIt);

/* of course we can run the task locally too */
testTasks.tasks.add.now({first:5, second:7}, logIt);

/* if we pass no callback, then the result is discarded */
testTasks.tasks.add.delayed({first:7,second:13});
