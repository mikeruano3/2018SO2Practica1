$(function() {
    $("#btnCompilarArriba").on("click", function (e) {
        cont = 0;
        var listapuntoslocal = listapuntos;
        listapuntos = [];
        recogerValordesdeServidor();
        $.ajax({
            url:"/analizartexto/generarCuadruplos",
            type: 'GET',
            data: {
                "listapuntos": listapuntoslocal
            },
            success : function(data){
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
                clearInterval(intervalo);
            }
        });
    });

    //setInterval(function(){ alert("Hello"); }, 1000);
    //var textoinit = document.getElementById("textoConsola").value;
    
    $( document ).ready(function() {
        recogerValordesdeServidor();
    });
    function recogerValordesdeServidor() {
         var funcionIntervalor = function(){
            $.ajax({
                url:"/obtener_lista_procesos",
                type: 'GET',
                // DATOS PARA MANDAR AL SERVIDOR
                data: {
                    "tipo": "VACIO"
                },
                dataType: 'json',
                success : function(data){
                    if(data.tipo == "NORMAL"){
                        var i, html, iteml;
                        html = "";
                        document.getElementById("listado").innerHTML = "";
                        for (i = 0; i < data.arreglo.length; i++) {
                            html += "<tr>";
                            html  += '<td>' + data.arreglo[i].nombre + '</td>';
                            html  += '<td>' + data.arreglo[i].user + '</td>';
                            html  += '<td>' + data.arreglo[i].pid + '</td>';
                            html  += '<td>' + data.arreglo[i].status + '</td>';
                            html  += '<td><a class="btn btn-danger" href="/proceso/matar/'+ data.arreglo[i].pid+'">Matar</a></td>';
                            html += '</tr>';
                        }
                        document.getElementById("listado").innerHTML = html;
                    }
                    //alert(data.tipo);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //clearInterval(intervalo);
                }
            });

        };
        intervalo =  setInterval(funcionIntervalor, 1000);
    }
});