var app = (function () {

    class Point{
        constructor(x, y){
            this.x = x;
            this.y = y;
        }        
    }
    
    var stompClient = null;
    
    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    // var addPolygonCanvas = function (polygon) {
    //     var canvas = document.getElementById("canvas");
    //     var ctx = canvas.getContext("2d");

    //     ctx.beginPath();
    //     if (polygon.points.length > 0) {
    //         ctx.moveTo(polygon.points[0].x, polygon.points[0].y);

    //         for (var i = 1; i < polygon.points.length; i++) {
    //             ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
    //         }

    //         ctx.closePath();
    //         ctx.stroke();
    //     }
    // };
    
    var getMousePosition = function (evt) {
        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
         stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var point = JSON.parse(eventbody.body);
                addPointToCanvas(new Point(point.x, point.y));
            });
            // stompClient.subscribe(`/topic/newpolygon.${number}`, function (eventbody) {
            //     var theObject = JSON.parse(eventbody.body);
            //     addPolygonCanvas(theObject);
            // });
        });
    };
    
    return {

        init: function () {
            var can = document.getElementById("canvas");
            // var button = document.getElementById("polygon");
            // Connect WebSocket
            connectAndSubscribe();

            // Listen for clicks on the canvas to publish points
            can.addEventListener("click", function(evt) {
                var mousePos = getMousePosition(evt);
                app.publishPoint(mousePos.x, mousePos.y);
            });

            // Listen for clicks on the button to connect points

            // button.addEventListener('click', function (evt) {
            //     valor = document.getElementById("connect").value;

            //     // Verificar que el campo no esté vacío y que el valor sea numérico
            //     if (valor && !isNaN(valor) && Number.isInteger(Number(valor)) && Number(valor) > 0) {
            //         // Limpiar el canvas antes de suscribirse y dibujar
            //         clearCanvas();

            //         // Desconectar si ya hay una conexión activa
            //         if (stompClient !== null) {
            //             stompClient.disconnect(function () {
            //                 console.log('Disconnected from previous subscription.');
            //                 connectAndSubscribe(valor);
            //             });
            //         } else {
            //             connectAndSubscribe(valor);
            //         }

            //         console.log('Attempting to connect with valor: ' + valor);
            //     } else {
            //         alert('Por favor ingrese un número válido.');
            //     }
            // });
        },

        publishPoint: function(px, py){
            var pt = new Point(px, py);
            //console.log("Publishing point at " + pt.x + ", " + pt.y);
            addPointToCanvas(pt);

            if (stompClient.connected) {

                console.info("Publishing point at " + pt.x + ", " + pt.y);
                stompClient.send("/app/newpoint", {}, JSON.stringify(pt));
            }
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        }
    };

})();
