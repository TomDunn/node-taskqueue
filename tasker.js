var redis   = require('redis');

/* Define tasks that can be done remotely */
function Tasker(opts) {

    opts = opts || {};
    this.queueName = opts.queueName
            ? opts.queueName
            : 'default_task_queue';


    this.client = redis.createClient();
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
    return function(taskDetails) {
        var task = {
            handler:    taskName,
            data:       taskDetails
        };

        that.client.rpush(that.queueName, JSON.stringify(task));
    };
};

/* the performer of delayed tasks */
function TaskWorker(opts) {
    if (!opts.tasks) throw "Must provide a Tasker object to worker constructor";

    this.client     = opts.tasks.client;
    this.queueName  = opts.tasks.queueName;
    this.tasks      = opts.tasks.tasks;
    this.delay      = opts.delay || 1000;

    var that = this;
    this.intervalId = setInterval(function() {
        that.checkForTasks();    
    }, this.delay);
};

TaskWorker.prototype.checkForTasks = function() {
    var that = this;
    this.client.lpop(this.queueName, function(err,val) {
        that.handleTask(err,val);
    });
};

TaskWorker.prototype.handleTask = function(err,val) {
    if (val == null) return;
    this.tasks[task.handler].now(task.data);
};

module.exports.TaskWorker = TaskWorker;
module.exports.Tasker = Tasker;
