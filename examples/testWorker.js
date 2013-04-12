#!/usr/bin/env node

var Worker      = require('../tasker.js').TaskWorker;
var testTasks   = require('./testTasks.js').testTasks;

var worker = new Worker({tasks: testTasks});
