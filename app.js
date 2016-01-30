/**
* Module dependencies.
*/
var express = require('express')
  , app = express()
  , bodyParser = require('body-parser');
  //, port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var exphbs  = require('express-handlebars');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var session = require('express-session');
var flash = require('express-flash');

/**
* path: .env
*/
if(process.env.MONGODB==null){
  dotenv.load({path: './.env'});
}

/**
* Configuracion handlebars
*/
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//app.set('view engine', 'views')

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
//app.use(require('./controllers'));

/**
* Rutas
*/
app.use(session({resave: true, saveUninitialized: true, secret: 'rubenonrails'}));
app.use(flash());

/**
* Controladores
*/
var homeController = require('./controllers/Home');
var administracionController = require('./controllers/Administracion');
var alertasController = require('./controllers/Alertas');
var comprarController = require('./controllers/Comprar');
var datosApiController = require('./controllers/DatosAPI');
var dronesApiController = require('./controllers/DronesAPI');
var emailController = require('./controllers/Email');
var error404Controller = require('./controllers/error404');
var loginRegistroController = require('./controllers/LoginRegistro');
var perfilController = require('./controllers/Perfil');
//error
var productosController = require('./controllers/Productos');
//ruta addProducto sin crear
var pronosticosController = require('./controllers/Pronosticos');
var rangoFechaController = require('./controllers/RangoFecha');
var tiendaController = require('./controllers/Tienda');
//var homeController = require('./controllers/validadarAPI');
//var homeController = require('./controllers/Estructura_Email');

/**
* Rutas principales
*/
app.get('/', homeController.index);
app.get('/cerrar', homeController.destroySession);
app.post('/login', loginRegistroController.login);
app.post('/register', loginRegistroController.registro);
app.get('/administracion', administracionController.admin);
app.get('/perfil', perfilController.perfil);
app.post('/perfil/datos', perfilController.datosPerfil);
app.post('/perfil/changePassword', perfilController.changePassword);
app.post('/contactar', emailController.contacto);
app.get('/tienda/:id_producto', tiendaController.tienda);
app.post('/comprar', comprarController.comprar);
app.post('/rangofecha', rangoFechaController.rangoFecha);
app.get('/activate/:activation/:email', emailController.activacion);
app.post('/forgetPassword', emailController.forgetPassword);
app.get('/recoverPassword/:key/:email', emailController.recoverPassword);
app.post('/newPassword', emailController.newPassword);
app.post('/alertas/update', alertasController.update);
app.get('/404', error404Controller.error);

  
/**
* Rutas API
*/
app.get('/productos', datosApiController.findProductos);
app.get('/productos/:id_producto', datosApiController.findProductosById);
app.get('/datos', datosApiController.findDatos);
app.get('/drones/:id_dron', dronesApiController.findDronesById);
app.get('/drones/usuario/:id_usuario', dronesApiController.findDronesUsuarioById);
//put a revisar
app.put('/drones/update/:id_dron', dronesApiController.updateDronName);
app.get('/datos/:id_dron', datosApiController.findDatosById);
app.get('/drones/producto/:id_dron', dronesApiController.datosProductoPorIdDron);
app.get('/datos/:id_dron/temperatura', datosApiController.findDatosTempById);
app.get('/datos/:id_dron/humedad', datosApiController.findDatosHumById);
app.get('/datos/:id_dron/co2', datosApiController.findDatosCo2ById);
app.get('/datos/:id_dron/radiacion', datosApiController.findDatosRadById);
app.get('/datos/:id_dron/luminosidad', datosApiController.findDatosLumById);
app.get('/alertas/rango/:id_dron', datosApiController.findMinMaxDronId);
app.get('/alertas/rango/temp/:id_dron', datosApiController.findMinMaxTempDronId);
app.get('/alertas/rango/hum/:id_dron', datosApiController.findMinMaxHumDronId);
app.get('/alertas/rango/co2/:id_dron', datosApiController.findMinMaxCo2DronId);
app.get('/alertas/rango/rad/:id_dron', datosApiController.findMinMaxRadDronId);
app.get('/alertas/rango/lum/:id_dron', datosApiController.findMinMaxLumDronId);
app.get('/alertas/rango/bat/:id_dron', datosApiController.findMinMaxBatDronId);
app.get('/datos/put/:id_dron/t/:temperatura/h/:humedad/co2/:co2/r/:radiacion/l/:luminosidad/b/:bateria', datosApiController.addDato);
app.post('/datos/put', datosApiController.addDatoPost);
app.get('/pronostico', pronosticosController.get);

/**
 * Ruta por defecto
 */
//app.use('*')

app.use("*", function(req,res){
  res.redirect('/');
});  


app.io = require('socket.io')();


var http = require('http');
var server = http.createServer(app);
app.io.attach(server); 

app.set('io',app.io);


/**
 * Start Express server.
 */
var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';

server.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
  
  //console.log("intento de conexion")
  mongoose.connect(process.env.MONGODB);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: :( '));
  db.once('open', function callback() {
    console.log('db connection open');
  });
});

//http://senserover-terrestre.rhcloud.com/
//http://sense-rover-nohtrim.c9users.io/
//dw32igsr@gmail.com