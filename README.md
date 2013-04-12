node-taskqueue
==============

Uses redis to distribute tasks among any number of workers. Workers have the ability to communicate results back to the initiator.

## TODO
Create an NPM package.

## Usage

see the examples directory

create your tasks file (testTasks.js)
```js
    var Tasker = require('./tasker.js').Tasker;
    var tasker = new Tasker();

    tasker.registerTask('add', function(data, done) {

        /* The first arg to done is any error
         * the second is the result of the task
         */

        done('', data.first + data.second);
    });

    module.exports.testTasks = tasker;
    
```

create your worker file (workerTest.js), running this file will create a worker process that polls the local redis server for task requests
```js
    #!/usr/bin/env node

    var Worker      = require('./tasker.js').TaskWorker;
    var testTasks   = require('./testTasks.js').testTasks;

    var worker = new Worker({tasks: testTasks});
```
open a shell, nav to folder, do: (leave it going)
    node workerTest.js

produce some work for the worker (testProducer.js)
```js
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
    testTasks.tasks.add.now({first:1, second:2}, logIt);

    /* if we pass no callback, then the result is discarded */
    testTasks.tasks.add.delayed({first:7,second:13});
```

open another shell, nav to examples folder:
    node testProducer.js

you should see some combination of 3, 5, and 12 being printed
