var fs = require('fs');
function mostrar_memoria(req, res){
    res.render('meminfo/meminfo', {
        lista: "lista"
    });
}

exports.get_memoria = function(req, res){
    mostrar_memoria(req, res);
}

exports.consultar_memoria = function(req, res){
    var MemTotal = 0;
    var MemFree = 0;
    var MemAvailable = 0;
    var Buffers = 0;
    var tipo = "NORMAL";
    try {
        var contenido = fs.readFileSync("/proc/meminfo_201503666", "utf8");
        if (!contenido) {
            throw error;
        }
        var meminfo = JSON.parse(contenido);
        MemTotal = meminfo.MemTotal;
        MemFree = meminfo.MemFree;
        MemAvailable = meminfo.MemAvailable;
        Buffers = meminfo.Buffers;
    }
    catch(err) {
        tipo = "ERROR";
    }
    //var arreglo = JSON.stringify(listaProcesos);
    res.send({
        "libreKB": MemFree,
        "librePorc": (MemTotal - MemFree)*100/MemTotal,
        "tipo": tipo
    });
}

function mostrar_cpu(req, res){
    res.render('cpu/cpuinfo', {
        lista: "lista"
    });
}

exports.get_cpu = function(req, res){
    mostrar_cpu(req, res);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}
exports.consultar_cpu = function(req, res){
    var USER = 0;
    var NICE = 0;
    var SYSTEM = 0;
    var IDLE = 0;
    var IOWAIT = 0;
    var IRQ = 0;
    var SOFTIRQ = 0;
    var STEAL = 0;
    var GUEST = 0;
    var GUESTNICE = 0;
    var PORCALCULADO = 0;
    var totald = 0;
    var idled = 0;
    var CPU_Percentage = 0;

    var tipo = "NORMAL";
    try {
        var contenido = fs.readFileSync("/proc/cpu_201503666", "utf8");
        if (!contenido) {
            throw error;
        }

        cpuinfo = JSON.parse(contenido);
        USER = cpuinfo.USER;
        NICE = cpuinfo.NICE;
        SYSTEM = cpuinfo.SYSTEM
        IDLE = cpuinfo.IDLE;
        IOWAIT = cpuinfo.IOWAIT;
        IRQ = cpuinfo.IRQ;
        SOFTIRQ = cpuinfo.SOFTIRQ;
        STEAL = cpuinfo.STEAL;
        GUEST = cpuinfo.GUEST;
        GUESTNICE = cpuinfo.GUESTNICE;
        PORCALCULADO = cpuinfo.PORCALCULADO;

/**
        var Idle = IDLE + IOWAIT;
        var NonIdle = USER + NICE + SYSTEM + IRQ + SOFTIRQ + STEAL + GUEST + GUESTNICE;
        var Total = Idle + NonIdle;
        totald = Total;
        idled = Idle;
        CPU_Percentage = (totald - idled)/totald*100;
*/
    CPU_Percentage = (IDLE * 100) / (USER + NICE + SYSTEM + IDLE + IOWAIT + IRQ + SOFTIRQ );
	if(CPU_Percentage == 0){
       	 tipo = "ERROR";
         console.log("ERROR");
	}
    }
    catch(err) {
        tipo = "ERROR";
        console.log(err);
    }
    //var arreglo = JSON.stringify(listaProcesos);
    res.send({
        "usadoKB": idled,
        "usadoPorc": CPU_Percentage,
        "tipo": tipo
    });
}
