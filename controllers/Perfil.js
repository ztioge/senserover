var mongoose = require('mongoose')
var Drones  = mongoose.model('Drones')
var Usuario  = mongoose.model('Usuario')

exports.perfil = function(req, res) {
    //ruta a la pagina de perfil
    
    var sess = req.session;
    console.log(sess.usuario)
    if(sess.usuario==""||sess.usuario==undefined) {
        res.redirect('/')  
    } else { //si no redireccion a pagina de inicio

        Usuario.findOne({ _id : sess.id_usuario }, function (err, datos_usuario) {
            if(err) {
                console.log(err)
            } else {
                Drones.find({ 'id_usuario': sess.id_usuario }, function (err, drones_encontrados) {
                    if(err) {
                        console.log(err)
                    } else {
                        var array_perfil = { drones_perfil:drones_encontrados, nombre_usuario: sess.usuario }
                        var array_perfil_datos = { datos_perfil:datos_usuario }
                        var arrays = {drones_perfil:drones_encontrados, datos_perfil:datos_usuario, nombre_usuario: sess.usuario}
                        //var arrays = {array_perfil, array_perfil_datos} // No funciona
                        res.render('perfil', arrays)
                    }
                })
            }
        })
    }
};

exports.datosPerfil = function(req, res) {
    //ruta a la pagina de perfil
    
    var sess = req.session;
    console.log(sess.usuario)
    if(sess.usuario==""||sess.usuario==undefined) {
        res.redirect('/')  
    } else { //si no redireccion a pagina de inicio

        var form_nombre = req.body.nombre
        var form_apellidos = req.body.apellidos
        var form_dni = req.body.dni
        var form_direccion = req.body.direccion
        var form_cp = req.body.cp
        var form_email = req.body.email // ¿Actualizar en BD?
        
        console.log('Nombre: ' + form_nombre)
        console.log('Apellidos: ' + form_apellidos)
        console.log('DNI: ' + form_dni)
        console.log('Dirección: ' + form_direccion)
        console.log('Código Postal: ' + form_cp)
        console.log('Email: ' + form_email)
        
        Usuario.findOneAndUpdate({ _id: sess.id_usuario }, { nombre: form_nombre, apellidos : form_apellidos, dni: form_dni, direccion : form_direccion, codigo_postal : form_cp }, function(err, user) {
            if (err) {
                console.error(err)
            } else {
                user.save(function (err) {
                    if (err) {
                      console.log('save error', err)
                    }
                })
                res.redirect('/perfil')
            } //else error
        });//find update
    }
};

exports.changePassword = function(req, res) {
   var pass_actual = req.body.pass_actual
   var pass_nueva = req.body.pass_nueva
   var pass_nueva_conf = req.body.pass_nueva_conf
   var id_usuario = req.body.id_usuario
   
   console.log('actual: ' + pass_actual)
   console.log('nueva: ' + pass_nueva)
   console.log('nueva conf: ' + pass_nueva_conf)
   console.log('id_usuario: ' + id_usuario)
};