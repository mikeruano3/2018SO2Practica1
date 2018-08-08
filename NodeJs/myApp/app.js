//set DEBUG=* & npm start
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mensajes = require('./routes/mensajes');
var modulo_procesos = require('./routes/modulo_procesos');
var modulo_general = require('./routes/modulo_general');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/enviar_mensaje', mensajes.get_enviar_mensaje);
app.post('/enviar_mensaje', mensajes.post_enviar_mensaje);
app.get('/listar_procesos', modulo_procesos.get_procesos);
app.get('/obtener_lista_procesos', modulo_procesos.enviar_procesos);
app.get('/proceso/matar/:indice', modulo_procesos.matar_proceso);
app.get('/meminfo', modulo_general.get_memoria);
app.get('/consultarmemoria', modulo_general.consultar_memoria);
app.get('/cpuinfo', modulo_general.get_cpu);
app.get('/consultarcpu', modulo_general.consultar_cpu);

app.get('/mensaje/:indice', mensajes.get_mensaje);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
