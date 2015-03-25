
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var like = require('./routes/likes');
var mail = require('./routes/mail');

var http = require('http');
var path = require('path');
var BSON = require('mongodb').BSONPure;
var validator = require('express-validator');
var app = express();

//db aacess
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/proj1')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(validator());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Asynchronous
var auth = express.basicAuth(function(user, pass, callback) {
	
 var result = (user === 'testUser' && pass === 'testPass');
 callback(null /* error */, result);
});

app.get('/', routes.index);
//user pages
app.get('/users', user.list(db));
app.get('/newuser', user.callNew);   //trying to get autehntication working
app.get('/viewuser', user.record(db));
app.get('/viewotheruser', user.otherrecord(db));
//like pages
app.get('/newlike', like.callNew); 
app.post('/addlike', like.add(db));
app.get('/viewlike', like.record(db));

app.get('/likeStuff', routes.likeStuff(db));
app.get('/help', routes.help(db));
app.get('/aboutUs', routes.aboutUs(db));
app.get('/friends', routes.friends(db));

app.get('/mail', mail.list(db));
app.get('/compose', mail.compose);
app.get('/respond', mail.record(db));

app.get('/login', user.login);
app.get('/logout', function (req, res) {
  delete req.session.authStatus;
  delete req.session.currentUser;
  res.send([
    'You are now logged out.',
    '&lt;br/>',
    '<a href="./login">Return to the login page. You will have to log in again.</a>',
  ].join(''));
});

app.post('/adduser', user.add(db));
app.post('/login', user.checklogin(db));
app.post('/edituser', user.edit(db));
app.post('/editlike', like.edit(db));
app.post('/query_mail', mail.query);
app.post('/addmail', mail.add(db));
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
