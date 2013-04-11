#!/usr/bin/node

var task    = require('./taskTest.js').testTasks;
var worker  = require('./tasker.js').TaskWorker;

var w = new worker({tasks: task});
