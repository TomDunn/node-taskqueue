node-taskqueue
==============

Uses redis to distribute tasks among any number of workers. Workers have the ability to communicate results back to the initiator.

## Installation
```sh
npm install node-taskqueue
```

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

testTasks.comm.on('ready', function() {
    /* Because we pass a callback, the callback will be
     * called with the result of our workers' work.
     * the delayed.add means that the task is pushed
     * to redis for distribution to workers
     */
    testTasks.tasks.add.delayed({first:1,second:2}, logIt);
    testTasks.tasks.add.delayed({first:2,second:3}, logIt);
    testTasks.tasks.add.delayed({first:2,second:5}, logIt);
    testTasks.tasks.add.delayed({first:3,second:5}, logIt);
    testTasks.tasks.add.delayed({first:3,second:7}, logIt);
    testTasks.tasks.add.delayed({first:5,second:7}, logIt);
    testTasks.tasks.add.delayed({first:7,second:11}, logIt);

    /* of course we can run the task locally too */
    testTasks.tasks.add.now({first:11, second:13}, logIt);

    /* if we pass no callback, then the result is discarded */
    testTasks.tasks.add.delayed({first:7,second:13});
});
```

open another shell, nav to examples folder:
    node testProducer.js


you should see some combination of 24, 3, 5, 7, 8, 10, 12 and 18 being printed in the testProducer processes stdout.

## License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
