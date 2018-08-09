var fs = require('fs');
var listaProcesos = [];
var psTree = require('ps-tree');

function leer_procesos(req, res){
    res.render('procesos/listar', {
        lista: listaProcesos
    });
}

function ObjProc(nombre, user, pid, status, cpu, mem){
    this.nombre = nombre;
    this.user = user;
    this.pid = pid;
    this.status = status;
    this.cpu = cpu;
    this.mem = mem;
}

exports.get_procesos = function(req, res){
    leer_procesos(req, res);
}

exports.enviar_procesos = function(req, res){
    listaProcesos = [];
    var tipo = "NORMAL";
    try {
        var contenido = fs.readFileSync("/proc/procesos_201503666", "utf8");
        if (!contenido) {
            throw error;
        }
        var listaProc = JSON.parse(contenido);
        for(var j=listaProc.lista.length-2; j>=0; j--) {
            var proc = listaProc.lista[j];
            var obj = new ObjProc(proc.NAME, proc.USER, proc.PID, proc.STATUS, proc.CPU, proc.MEM);
            listaProcesos.push(obj);
        }
    }
    catch(err) {
        tipo = "ERROR";
        listaProcesos = [];
    }
    //var arreglo = JSON.stringify(listaProcesos);
    res.send({
        "arreglo": listaProcesos,
        "tipo": tipo
    });
}

var kill = function (pid, signal, callback) {
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    var killTree = true;
    if(killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) { }
            });
            callback();
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback();
    }
};

exports.matar_proceso = function(req, res){
    var indice = req.params.indice;
    //console.log(indice);
    kill(indice);
    leer_procesos(req, res);
}