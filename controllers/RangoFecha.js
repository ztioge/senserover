var Dato = require("../models/Dato");

exports.rangoFecha = function(req, res) {
    var dato_form = req.body.dato;
    var id_dron = req.body.name_dron_rango;
    var fecha_inicio = req.body.Rango_fecha_inicio;
    var fecha_final = req.body.Rango_fecha_final;

    console.log('Dato: ' + dato_form);
    console.log('Id_dron: ' + id_dron);
    console.log('Fecha inicio: ' + fecha_inicio); // 2015-12-11
    console.log('Fecha final: ' + fecha_final); //2016-01-08

    //Dato.find({id_dron : id_dron, fecha: {$ne: [fecha_inicio, fecha_final]}}, function (err, dato) {
    //Dato.find({id_dron : id_dron, fecha : {$gte : fecha_inicio, $lte: fecha_final}}, function (err, dato) {
    Dato.find({
        id_dron: id_dron,
        fecha: {
            $gte : fecha_inicio,
            $lte: fecha_final
        }
    }, function(err, dato) {
        if (err) {
            console.log('prueba ruben: error occured in the database');
        }
        console.log('prueba ruben ' + dato);
        res.send(dato);
        //console.log("prueba humedad: "+dato[0].humedad)
    }).sort({fecha: 1});
};