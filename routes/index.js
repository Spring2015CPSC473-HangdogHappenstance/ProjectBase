
/*
 * GET home page.
 */


var BSON = require('mongodb').BSONPure;
var ImEnabled = false;

exports.index = function(req, res){
	var id = "53411393969cb15e5f000001";
	req.session.currentUser = {
		'_id': BSON.ObjectID.createFromHexString(id),
		'username': "jhocast" 
	}
	req.session.curRecord = {};
	console.log(req.session.currentUser);
  	res.render('index', { title: 'Express' });
};

exports.dashboard = function(db){
	return function(req, res){
		req.session.curRecord = {};
		var collection = db.get('accounts');
		var collection1 = db.get('Projects');
		var collection2 = db.get('Tasks');
		var collection3 = db.get('Timesheets');
		
		collection.find({},{}, function(e, docs){
			collection1.find({},{}, function(e,proj){
				collection2.find({}, {}, function(e, task) {
				collection3.find({}, {}, function(e, timesheet) {
						res.render('dashboard', {
							"dashboard": docs,
							"projectlist": proj,
							"tasklist": task,
							"timesheetlist" : timesheet
						});
					});
				});
			});
		});
	};
};

exports.checkAuth=function(req, res, next) {
       if (req.url!=null) {
         console.log("basicAuth");
           var auth = express.basicAuth(function(username, password,fn) {
           MongoClient.connect("mongodb://localhost:27017/proj1", function(err, db) {
             var collection =db.collection("accounts");
             collection.findOne({username:username}, function(err, doc){
               if (err) {
                 throw err;
               }

               if (doc === null) {
                 fn(null, null);
                 db.close();
       
               }
               else {
                 fn(null, doc.password === password ? doc.username : null);
                 db.close();
       
               }
           });
         });
   });
   
           auth(req, res, next);
       } else {
           return next();
       }
 };

