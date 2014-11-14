var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
//necesario para utilizar los verbos put y delete en formularios
var methodOverride = require('method-override');
var csrf = require('csrf');

var routes = require('./routes/index');
var users = require('./routes/users');
 
var app = express();
 
// Use ./views as the default path for the client-side templates
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs").renderFile);
// Automatically load index.html files just by passing index
app.set('view engine', 'html');
 
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
//configuramos methodOverride
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
 
//Parse the HTTP Cookie header and create 
// an object in req.cookies with properties for each cookie
app.use(cookieParser('keyboard cat'));
// Use a session store – this is needed for the CSRF middleware
app.use(session({secret: '<mysecret>', 
                 saveUninitialized: true,
                 resave: true}));
app.use(flash());
//  The CSRF protection middleware
// app.use(csrf());
// Serve static files in the ./public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
 
module.exports = app;