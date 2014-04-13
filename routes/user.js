
/*
 * GET users listing.
 */
var BSON = require('mongodb').BSONPure,
	tableName = 'accounts';

exports.list = function(db){
	return function(req, res){
		var collection = db.get(tableName);
		var collection1 = db.get('Tasks');
		var collection2 = db.get('Projects');
		var collection3 = db.get('Timesheets');
		
		collection.find({},{}, function(e, account) {
			collection1.find({},{}, function(e, task) {
				collection2.find({}, {}, function(e, proj) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('users', {
							"users": account,
							"tasklist": task,
							"projectlist": proj,
							"timesheetlist" : timesheet
						});
					});
				});
			});
		});
	};
};

exports.record = function(db){
	return function(req, res){
		var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
			collection = db.get(tableName);
			collection1 = db.get('Timesheets');
			collection2 = db.get('Tasks');
			collection3 = db.get('Projects');
		req.session.curRecord = { "table": tableName, "_id" : obj_id }
		console.log('req.session.curRecord', req.session.curRecord);
		collection.find({_id: obj_id},{}, function(e, account){
			console.log('timesheet search for:', req.query._id);
			collection1.find({"user": req.query._id},{}, function(e, timesheet){
				var filter = [];
				for (var rec in timesheet)
					filter.push(BSON.ObjectID.createFromHexString(timesheet[rec].Task));
				collection2.find({_id: {$in: filter}}, {}, function(e, task) {
					var filter = [];
					for (var t in task)
						filter.push(BSON.ObjectID.createFromHexString(task[t].Project));
					collection3.find({_id: {$in: filter}}, {}, function(e, proj) {
						req.session.oldValues = account;
						res.render('viewuser', {
							"userlist": account, 
							"timesheetlist" : timesheet,
							"tasklist": task,
							"projectlist": proj,
							"IsEnabled": false
						});
					});
				});
			});
		});
	};
};

exports.add = function(db){
	return function(req, res){
		//req.assert('userName', 'User Name is  required').notEmpty();           
    	//req.assert('userEmail', 'User Email is required').notEmpty();
    	//req.assert('userPassword', 'Password is required').notEmpty();
		//req.assert('status', 'Status Detail is required').notEmpty();
		//req.assert('endtime', 'End Date is required').notEmpty(); 	
	    //req.assert('role', 'Role is required').notEmpty(); 
		
		//var errors = req.validationErrors(); 
		//console.log(errors);
    	//if( !errors) {   //Display errors to 
		
		console.log('req.body\n', req.body);
		var userName = req.body.username,
			userEmail = req.body.useremail,
			userPassword = req.body.userpassword,
			status = {"Level": req.body.status.key, "Name": req.body.status.value},
			role = {"Level": req.body.role, "Name": req.body.selected},
			collection =db.get(tableName);
			var record = {
				"username": userName,
				"email": userEmail,
				"password": userPassword,
				"status" : "Initialized",
				"Role" : role,
				"EnteredOn": new Date(),
				"CreatedBy": req.session.currentUser
			}
		console.log('req.body.status\n', req.body.status);
		collection.insert(record, function(err, doc) {
			if(err){
				res.send("Psh what database");
			}
			else {
				res.location("users");
				res.redirect("users");
			}
		});
		//} else {
		//	res.render('newuser', { errors: errors, messges:errors });		
		//}
	}
}

exports.edit = function(db){
	return function(req, res){
		console.log('exports.edit');
		var collection =db.get(tableName);
		if (req.body['delete']==='') {
			console.log('going to delete');
			var project = { _id : BSON.ObjectID.createFromHexString(req.query._id) };
			collection.remove(project, function(err, doc) {
				if(err){
					res.send("Psh what database");
				}
				else {
					console.log("Record deleted successful");
					res.location("dashboard");
					res.redirect("dashboard");
				}
			});
		} else if (req.body['edit']==='') {
			var filter = { _id : BSON.ObjectID.createFromHexString(req.query._id) };
			console.log('req.sessions.oldValues\n', req.session.oldValues);
			console.log('req.session.req.body\n', req.body);
			var updateList = {}
			collection.update(filter, {$set: updateList}, {}, function(err, doc) {
				if(err){
					res.send("Psh what database");
				}
				else {
					console.log("Record deleted successful");
					res.location("dashboard");
					res.redirect("dashboard");
				}
			});
		} else {
			
			console.log('exports.edit', req.query._id!=null ? req.query._id: "no value");
			var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
				collection1 = db.get('Timesheets'),
				collection2 = db.get('Tasks'),
				collection3 = db.get('Projects');
			if (req.body['enabler']==='') {
				console.log("Enabled");
				console.log(req);
				IsEnabled = true;
			} else {
				console.log("Not Enabled");
				IsEnabled = 'Disabled';
			}
			console.log('IsEnabled', IsEnabled);
			collection.find({_id : obj_id},{}, function(e, account){
				collection1.find({"user": req.query._id},{}, function(e, timesheet){
					var filter = [];
					for (var rec in timesheet)
						filter.push(BSON.ObjectID.createFromHexString(timesheet[rec].Task));
					collection2.find({_id: {$in: filter}}, {}, function(e, task) {
						var filter = [];
						for (var t in task)
							filter.push(BSON.ObjectID.createFromHexString(task[t].Project));
						collection3.find({_id: {$in: filter}}, {}, function(e, proj) {
							res.render('viewuser', {
								"userlist": account, 
								"timesheetlist" : timesheet,
								"tasklist": task,
								"projectlist": proj,
								"IsEnabled": IsEnabled
							});
						});
					});
				});
			});
		}
	};
};
exports.callNew = function(req, res){
	res.render('newuser', {title: "Add a New User"});
};

exports.login=function(req,res){
	res.render('login',{title:"New User Registration"});
};

//this is broken cannot get it to proceed;
exports.checklogin = function(db, next){
	return function(req, res, next){
		
		var userName = req.body.username;
		var userPassword = req.body.userpassword;
		var collection =db.get(tableName);
		//console.log(collection.find({},{},function(e, accounts){console.log(accounts)}));
		console.log(collection);
		collection.findOne({
			"username": userName,
			"password": userPassword,
			}, function(err, doc) {
			if(err){
				console.log(err);
				res.send("Psh what database");
			}
			if(doc === null){
				console.log("No account pass match");
				res.location("login");
				res.redirect("login");
			}
			else {
				console.log("inside checklogin");
				console.log(doc);
				return next();
			}
			
		});
	}
}
