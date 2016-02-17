var milatitud;
var milongitud;

/*function initialize() {
    var myLatLng = new google.maps.LatLng(44, -2);
    var mapa1 = new google.maps.Map(document.getElementById('mapa1'), {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: myLatLng
    });
    //array_push($markers, $lat, $lng, $titulo);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: mapa1
    });

    google.maps.event.addDomListener(window, 'load', initialize);
}*/


function iniciarMapa1(latitud, longitud) {
    //console.log("iniciar mapa1: lat:" + latitud + " lon:" + longitud);
    var centro = new google.maps.LatLng(latitud, longitud);
    var mapa1 = new google.maps.Map(document.getElementById('mapa1'), {
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: centro
    });
    var marker = new google.maps.Marker({
        position: centro,
        map: mapa1,
        title: 'Ultima posicion del dron'
    });
    //google.maps.event.addDomListener(window, 'load', iniciarMapa1);
}

function iniciarMapa2(latitudes, longitudes) {
    //console.log("iniciar mapa2: lat:" + latitudes + " lon:" + longitudes);

    var ultimapos = new google.maps.LatLng(latitudes[latitudes.length - 1], longitudes[longitudes.length - 1]);
    //console.log("ultima posicion "+ultimapos);
    var mapa2 = new google.maps.Map(document.getElementById('mapa2'), {
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: ultimapos
    });
    
    //array_push($markers, $lat, $lng, $titulo);

    var ruta = [];

    for (var i = 0; i < latitudes.length; i++) {
        //console.log("bucle pos:" + i);
        var marker = new google.maps.Marker({
            position: {
                lat: latitudes[i],
                lng: longitudes[i]
            },
            map: mapa2,
        });
        ruta.push({
            lat: latitudes[i],
            lng: longitudes[i]
        });
    }
    
    var lineas = new google.maps.Polyline({
        path: ruta,
        map: mapa2,
        strokeColor: '#222000',
        strokeWeight: 4,
        strokeOpacity: 0.6,
        clickable: false
    });
    //google.maps.event.addDomListener(window, 'load', iniciarMapa2);
}