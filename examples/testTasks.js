var Tasker = require('../tasker.js').Tasker;
var tasker = new Tasker();

tasker.registerTask('add', function(data, done) {

    /* The first arg to done is any error
     * the second is the result of the task
     */

    done('', data.first + data.second);
});

module.exports.testTasks = tasker;
