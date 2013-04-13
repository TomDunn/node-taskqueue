var redis   = require('redis');
var uuid    = require('node-uuid');

/* Define tasks that can be done remotely */
function Tasker(opts) {

    opts = opts || {};
    this.queueName = opts.queueName
            ? opts.queueName
            : 'default_task_queue';


    this.client = redis.createClient();
    this.comm   = redis.createClient();
    this.tasks  = {};
}

/* register a task
 * taskName - String    - the name of the task
 * taskFunc - function  - implementation of the task
 */
Tasker.prototype.registerTask = function(taskName, taskFunc) {
    this.tasks[taskName]    = {
        delayed:    this.delayedTask(taskName),
        now:        taskFunc
    };
};

Tasker.prototype.delayedTask = function(taskName) {
    var that = this;
    return function(taskDetails, cb) {

        var task = {
            handler:    taskName,
            data:       taskDetails
        };

        if (cb) {
            var resultChannel = 'result-' + uuid.v4();
            task.resultChannel = resultChannel;

            that.comm.subscribe(resultChannel);
            that.comm.on('message', function(channel, message) {
                if (resultChannel !== channel) return;

                that.comm.unsubscribe(channel);

                var result = JSON.parse(message);
                cb(result.error, result.data);
            });
        }

        that.client.rpush(that.queueName, JSON.stringify(task));
    };
};

/* the performer of delayed tasks */
function TaskWorker(opts) {
    if (!opts.tasks) throw "Must provide a Tasker object to worker constructor";

    this.client     = opts.tasks.client;
    this.comm       = opts.tasks.comm;
    this.queueName  = opts.tasks.queueName;
    this.tasks      = opts.tasks.tasks;

    this.checkForTasks();
};

TaskWorker.prototype.checkForTasks = function() {
    var that = this;
    this.client.blpop(this.queueName, 0, function(err,val) {
        that.handleTask(err,val);
    });
};

TaskWorker.prototype.handleTask = function(err,val) {
    if (val == null) return;

    var that = this;
    var task = JSON.parse(val[1]);
    this.tasks[task.handler].now(task.data, function(err,res) {
        if (!task.resultChannel) return;

        var result = {
            error: err,
            data:  res
        }

        that.comm.publish(task.resultChannel, JSON.stringify(result));
    });

    that.checkForTasks();
};

module.exports.TaskWorker = TaskWorker;
module.exports.Tasker = Tasker;
