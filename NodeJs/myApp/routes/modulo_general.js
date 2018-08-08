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
/*
        var cpuinfo = JSON.parse(contenido);
        var PREVUSER = cpuinfo.USER;
        var PREVNICE = cpuinfo.NICE;
        var PREVSYSTEM = cpuinfo.SYSTEM
        var PREVIDLE = cpuinfo.IDLE;
        var PREVIOWAIT = cpuinfo.IOWAIT;
        var PREVIRQ = cpuinfo.IRQ;
        var PREVSOFTIRQ = cpuinfo.SOFTIRQ;
        var PREVSTEAL = cpuinfo.STEAL;
        var PREVGUEST = cpuinfo.GUEST;
        var PREVGUESTNICE = cpuinfo.GUESTNICE;

        //PORCALCULADO = cpuinfo.PORCALCULADO;
        //sleep(5);
        contenido = fs.readFileSync("/proc/cpu_201503666", "utf8");
        if (!contenido) {
            throw error;
        }
*/
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

        /*** CODIGO INTERNET  */
//        var PrevIdle = PREVIDLE + PREVIOWAIT;
        var Idle = IDLE + IOWAIT;

//        var PrevNonIdle = PREVUSER + PREVNICE + PREVSYSTEM + PREVIRQ + PREVSOFTIRQ + PREVSTEAL;
        var NonIdle = USER + NICE + SYSTEM + IRQ + SOFTIRQ + STEAL + GUEST + GUESTNICE;

//        var PrevTotal = PrevIdle + PrevNonIdle;
        var Total = Idle + NonIdle;

        // differentiate: actual value minus the previous one
        totald = Total;// - PrevTotal;
        idled = Idle;// - PrevIdle;

        CPU_Percentage = (totald - idled)/totald*100;
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
