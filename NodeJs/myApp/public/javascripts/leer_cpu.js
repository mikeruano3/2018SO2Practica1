var fs = require('fs');

// An object to store our data
var stat = {
    cpu: {
        user: 0,
        nice: 0,
        system: 0,
        idle: 0,
        iowait: 0,
        irq: 0,
        softirq: 0,
        total: 0
    },
    prevTotal: 0,
    prevIdle: 0
};

exports.getTimes = function(callback) {
    "use strict";

    var cpu = {
        total: 0
        , user: 0
        , nice:  0
        , system: 0
        , idle: 0
        , iowait: 0
        , irq: 0
        , softirq: 0
    };

    fs.readFile('/proc/stat', 'utf8', function (error, stat) {
        if (error) {
            throw error;
        }
        var stat = stat.split('\n');
        stat.forEach(function(line) {
            if(line.indexOf("cpu ") == 0) {
                // trim multiple spaces and tabs
                line = line.replace(/\s+/g, ' '); // trim spaces
                line = line.split(" "); // each field is separated by a... space
                // Discard the "cpu" prefix.
                line = line.slice(1);
                cpu.user = line[0],
                cpu.nice = line[1],
                cpu.system = line[2],
                cpu.idle = line[3],
                cpu.iowait = line[4],
                cpu.irq = line[5],
                cpu.softirq = line[6],
                line.forEach(function(value) {
                    cpu.total += parseInt(value, 10);
                });
            }
        });
        callback(cpu);
        
    });
}
// A timer to print the data
var timer = setInterval(function() {

    var time = exports.getTimes(function(time){
        var diffIdle = time.idle - stat.prevIdle;
        var diffTotal = time.total - stat.prevTotal;
        var diffUsage = ( 1000 * ( diffTotal - diffIdle) / diffTotal + 5 ) / 10;

        console.log("CPU: " + parseFloat(diffUsage,2) + "%");
        // Remember the total and idle CPU times for the next check.
        stat.prevTotal = time.total;
        stat.prevIdle = time.idle;
    });
}, 500);

