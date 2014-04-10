
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//var project = require('./routes/project.js');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/userlist', routes.userlist(db));
app.get('/newuser', routes.newuser);
app.get('/newproject', routes.newproject);
app.get('/newtask', routes.newtask);
app.get('/newtimesheet', routes.newtimesheet);

app.get('/dashboard', routes.dashboard(db));
app.get('/projects', routes.projects(db));
app.get('/timesheets', routes.timesheets(db));
app.get('/tasks', routes.tasks(db));
app.get('/viewproject', routes.project(db));
app.get('/editproject', routes.project(db));

app.post('/adduser', routes.adduser(db));
app.post('/addproject', routes.addproject(db));
app.post('/addtask', routes.addtask(db));
app.post('/addtimesheet', routes.addtimesheet(db));
app.post('/editproject', routes.editproject(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
