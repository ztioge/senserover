var mongoose = require('mongoose');
var Usuario  = mongoose.model('Usuario');
var bcrypt = require('bcrypt');
//var express = require('express');
//var validator = require('validator');

var estructura_email = require('./Estructura_Email');

exports.login = function(req, res) {
    //post de formulario de login
    var sess = req.session;
    var form_usuario = req.body.usuario;
    var form_pass = req.body.contrasenya;
    
    console.log("Usuario login: " + form_usuario);
    console.log("Pass login: " + form_pass);
    
    // Validacion servidor
    req.assert('usuario', 'Usuario es requerido.').notEmpty();
    req.assert('contrasenya', 'La contraseña es requerida.').notEmpty();
    req.assert('contrasenya', 'Usa al menos 8 caracteres.').len(3,20); //Hay que cambiar el valor 2 por 3
    
    var errors = req.validationErrors();
    
    console.log(errors);
    
    if (errors) {
      //req.flash('error', errors);
      return res.redirect('/');
    }
    
    Usuario.findOne({ usuario: form_usuario }, function (err, usuario) {   
        if (err) {
            console.error(err);
        } else {
          if (usuario!=null) {
            console.log('Find one usuario:' + usuario.usuario);
        
            usuario.comparePassword(form_pass, function(err, isMatch) {
              if (err) throw err;
              console.log('comprobacion: ' + form_pass, isMatch);
              if (isMatch) {
                if (usuario.validated) {
                  console.log('usuario activado');
                  console.log(req.ip);
                  //crear sesion
                  sess.usuario=usuario.usuario;
                  sess.id_usuario=usuario._id;
                  console.log(" id de usuario "+sess.id_usuario+" usuario "+sess.usuario);
                  
                  var fecha = new Date();
                	var fecha = fecha.setHours(fecha.getHours()+1);
                	//fecha.setUTCHours(12)
                	//fecha=fecha.setUTCHours(15)
                	console.log(fecha);
                	//console.log("fecha en milisegundos " + fecha)
                	//fecha=new Date(fecha)
                	
                	console.log('ultima conexion: ' + usuario.ultima_conexion);
                  //console.log('prueba pagina:'+req.body.pagina)
                  if(req.body.pagina=="compra"){
                    Usuario.findOneAndUpdate({ _id: sess.id_usuario }, { ultima_conexion: fecha }, function(err, user) {
                      if (err) throw err;
                      res.redirect('tienda/'+sess.id_producto);
                    });
                  }else if(usuario.ultima_conexion == undefined){
                    
                	  //sin comporvar
                	  //console.log("actualizacion1")
                    Usuario.findOneAndUpdate({ _id: sess.id_usuario }, { ultima_conexion: fecha }, function(err, user) {
                      if (err) throw err;
                    });
                    
                    res.redirect('/perfil');
                    
                  } else {
                    
                    //console.log("actualizacion2")
                    Usuario.findOneAndUpdate({ _id: sess.id_usuario }, { ultima_conexion: fecha }, function(err, user) {
                      if (err) throw err;
                    });
                  
                    //redirect no render desde compra o render desde index
                    //if pagina_form=index
                    //var array_index={usuario:sess.id_usuario}
                    //res.render('index', array_index)
                    //else if pagina_form=compra
                    //res.render(compra, array_compra)
                    
                    //console.log('pre redirect')
                    res.redirect('/');
                  }
                  
                } else {
                  console.log('usuario NO activado');
                  //res.redirect('/')
                  //flash de errores
                  req.flash('error', ' El usuario no esta activado..');
                  //res.render('index', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });
                  res.redirect('/');
                }
              } else {
                console.log('contraseña incorrecta');
                //res.redirect('/')
                //flash de errores
                req.flash('error', ' El nombre de usuario o la contraseña son incorrectos.');
                //res.render('index', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });
                res.redirect('/');
              }                     
            });
          } else {
            console.log('usuario no registrado');
            //res.redirect('/')
            //flash de errores
            /* res.render("index.handlebars", {layout: 'main.handlebars', action: 'login', error: req.flash('error')
                });*/
            req.flash('error', ' El usuario no está registrado.');
            //res.render('index', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });
            res.redirect('/');
          } 
        }
    });
};

exports.registro = function(req, res) {
  //post de formulario de registro
  //envio de correo de activacion
  console.log("registro");
  
  var form_usuario = req.body.usuario;
  var form_email = req.body.email;
  var form_pass = req.body.contrasenya;
  var form_pass2 = req.body.contrasenya2;
  console.log("Usuario registro: " + form_usuario);
  //console.log("email registro: " + form_email)
  //console.log("Pass 1: " + form_pass)
  //console.log("Pass 2: " + form_pass2)
  
    // Validacion servidor
    req.assert('usuario', 'Usuario es requerido.').notEmpty();
    req.assert('email', 'El campo email es requerido.').notEmpty();
    req.assert('email', 'Email no valido.').isEmail();
    req.assert('contrasenya', 'La contraseña es requerida.').notEmpty();
    req.assert('contrasenya', 'Usa al menos 8 caracteres.').len(3,20); //Hay que cambiar el valor 2 por 3
    req.assert('contrasenya2', 'La contraseña es requerida.').notEmpty();
    req.assert('contrasenya2', 'Usa al menos 8 caracteres.').len(3,20); //Hay que cambiar el valor 2 por 3
    
    var errors = req.validationErrors();
    
    console.log(errors);
    
    if (errors) {
      //req.flash('error', errors);
      return res.redirect('/');
    }
  
  Usuario.findOne({usuario: form_usuario}, function (err, usuario) {
    if (err) {
        console.error(err);
    } else {
      
      if(usuario==null){
        console.log('el usuario no existe');
        
        var salt = bcrypt.genSaltSync(10);
        var pass_coded = bcrypt.hashSync(form_pass, salt);
        console.log(bcrypt.compareSync(form_pass2, pass_coded));
        console.log(pass_coded);
              
        if (bcrypt.compareSync(form_pass2, pass_coded)){
          var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
          var new_key = "";
          for (var i = 0; i < 32; i++) {
              new_key += chars[Math.floor(Math.random()*35)];
          }
      
          //creacion de usuario
          //var usuario = new Usuario({usuario : form_usuario, pass : pass_coded, email : form_email, activacion_key : new_key, validated : 0})
          //var usuario = new Usuario({ _id: ,usuario : form_usuario, pass : pass_coded, email : form_email, activacion_key : new_key, validated : 0})
          var usuario = new Usuario({ usuario : form_usuario,nombre: null, apellidos : null, dni: null, direccion : null, codigo_postal : null, pass : pass_coded, email : form_email, activacion_key : new_key, validated : 0, ultima_conexion: null});
          
          //guardar usuario en la base de datos
          usuario.save(function (err) {
            if (err) {
              console.log('save error', err);
            } else{
              var nombre_remitente = 'Sense-Rover';
              var email_remitente = 'dw32igsr@gmail.com';
              var nombre_destinatario = form_usuario;
              var email_destinatario = form_email;
              var asunto = 'Registro en sense-rover';
              var mensaje = "<h1>Hola " + form_usuario + "!</h1><br><p>Gracias por registrarse en nuestro sitio.<br>Su cuenta ha sido creada, y debe ser activada antes de poder ser utilizada.<br>Para activar la cuenta, haga click en el siguiente enlace:</p><br><a href='http://senserover-terrestre.rhcloud.com/activate/"+new_key+"/"+form_email+"'>Activar la cuenta</a>";
              
              estructura_email.estructura_email(req, res, nombre_remitente, email_remitente, nombre_destinatario, email_destinatario, asunto, mensaje);
            }
          });
          
        } else {
            console.log('Las pass no es la misma');
        }
      } else {
        //console.log('el usuario ya existe')
        console.log('el usuario ya existe');
        req.flash('error', ' El usuario ya existe.');
        res.render('index', { expressFlash: req.flash('error'), sessionFlash: res.locals.sessionFlash });
      }
    }  
  });
  //res.render("index.handlebars", {layout: 'index.handlebars', action: 'Register', error: req.flash('error'),});
  res.render("index.handlebars", {layout: 'main.handlebars', action: 'Register', error: req.flash('error')});
};