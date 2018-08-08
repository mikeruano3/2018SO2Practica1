$(function() {
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var updateInterval = 300;
    var intervalo;
    var cola = [];
    $( document ).ready(function() {
        intervalo =  setInterval(funcionIntervalor, updateInterval);
    });
    function recogerValordesdeServidor() {

    }
    var funcionIntervalor = function(){
        $.ajax({
            url:"/consultarmemoria",
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
                    document.getElementById("librePorc").innerHTML = "Porcentaje: " + data.librePorc + "%";
                    document.getElementById("libreKB").innerHTML = "Libre: "+ data.libreKB + " KB";
                    cola.push(data.librePorc);
                }
                //alert(data.tipo);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //clearInterval(intervalo);
            }
        });
    };

    var totalPoints = 300;

    function getRandomData() {
	var puntoerror = 0;
	if(cola.length > 0){
	  puntoerror = cola[0];  
	}
        if (cola.length > 0)
            cola = cola.slice(1); //quitar el ultimo
            //pedazo desde la posicion 1

        // Do a random walk
        /*
        while (data.length < totalPoints) {

            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;

            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }  
            
            data.push(y);
        }
        */
        while (cola.length < totalPoints) {
            cola.push(puntoerror);
        }
        // Zip the generated y values with the x values

        var res = [];
        for (var i = 0; i < cola.length; ++i) {
            res.push([i, cola[i]])
        }
        return res;
    }

    function puntosInicio() {
        var res = [];
        for (var i = 0; i < totalPoints; ++i) {
            res.push([i, 0]);
        }
        return res;
    }

    // Set up the control widget

    
    $("#updateInterval").val(updateInterval).change(function () {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 2000) {
                updateInterval = 2000;
            }
            clearInterval(intervalo);
            intervalo =  setInterval(funcionIntervalor, updateInterval);
            $(this).val("" + updateInterval);
        }
    });

    var plot = $.plot("#placeholder", [ puntosInicio() ], {
        series: {
            shadowSize: 0	// Drawing is faster without shadows
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            show: false
        }
    });

    function update() {
        plot.setData([getRandomData()]);

        // Since the axes don't change, we don't need to call plot.setupGrid()

        plot.draw();
        setTimeout(update, updateInterval);
    }

    update();

    // Add the Flot version string to the footer

    $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});
