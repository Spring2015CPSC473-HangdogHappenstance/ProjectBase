var BSON = require('mongodb').BSONPure,
	tableName = 'Tasks';

exports.callNew = function(db){
	return function(req, res){
		console.log('exports.Newest');
		var collection = db.get('Projects')
		collection.find({},{}, function(e, proj){
			res.render('newtask', {
				"projectlist": proj,
				title: "Add a New Task",
				curRecord: (req.session.curRecord != null) 
					? req.session.curRecord: undefined
			});
		});
	};
};

exports.add = function(db) {
	return function(req, res){
		var taskName = req.body.Name,
			Status = req.body.status,
			projEstDuration = req.body.duration;
		var project = {}
		if (req.session.curRecord && req.session.curRecord['table']==='Projects'){
			console.log("getting value from req.session.curRecord", req.session.curRecord);
			project['_id'] = req.session.curRecord['_id']
			project['Name'] = req.session.curRecord['Name']
		} else {
			console.log("getting value from req.body.Project", req.body.Project);
			project['_id'] = req.body.Project;
			project['Name'] = req.body.Project;
		}	
		console.log("here is your project", project);
		var task = {
			"Name" : taskName,
			"EstimatedDuration" : projEstDuration,
			"Status" : Status,
			"Project" : project['_id'],
			"ClockedTime" : 0,
			"EnteredOn": new Date(),
			"CreatedBy": req.session.currentUser
		}
		console.log("task\n", task);
		var collection =db.get(tableName);
		collection.insert(task, function(err, doc) {
			if(err){
				res.send("Psh what database");
			}
			else {
				console.log("Task inserted successful");
				res.location("dashboard");
				res.redirect("dashboard");
			}
			
		});
	}
}

exports.record = function(db){
	return function(req, res){
		console.log('exports.record');
		var obj_id = BSON.ObjectID.createFromHexString(req.query._id),
			collection = db.get('Tasks'),
			collection1 = db.get('accounts'),
			collection2 = db.get('Projects'),
			collection3 = db.get('Timesheets');

		console.log(req.session.curRecord);
		collection.find({_id: obj_id},{}, function(e, task){
			req.session.curRecord = {
				"table": tableName,
				"_id" : obj_id,
				"Name": task[0].Name
			}
			collection1.find({},{}, function(e,account){
				collection2.find({}, {}, function(e, proj) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('viewtask', {
							"tasklist": task,
							"userlist": account,
							"projectlist": proj,
							"timesheetlist" : timesheet
						});
					});
				});
			});
		});
	};
};

exports.list = function(db){
	return function(req, res){
		console.log('exports.list');
		var collection = db.get('Tasks');
		var collection1 = db.get('accounts');
		var collection2 = db.get('Projects');
		var collection3 = db.get('Timesheets');
		collection.find({},{}, function(e, task){
			collection1.find({},{}, function(e,account){
				collection2.find({}, {}, function(e, proj) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('tasks', {
							"tasklist": task,
							"userlist": account,
							"projectlist": proj,
							"timesheetlist" : timesheet
						});
					});
				});
			});
		});
	};
};

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
				collection1 = db.get('accounts'),
				collection2 = db.get('Projects'),
				collection3 = db.get('Timesheets');
			if (req.body['enabler']==='') {
				console.log("Enabled");
				console.log(req);
				IsEnabled = true;
			} else {
				console.log("Not Enabled");
				IsEnabled = 'Disabled';
			}
			console.log('IsEnabled', IsEnabled);
			console.log(req.session.curRecord);
			collection.find({_id: obj_id},{}, function(e, task){
				collection1.find({},{}, function(e,account){
					collection2.find({}, {}, function(e, proj) {
						collection3.find({Task: req.query._id}, {}, function(e, timesheet) {
							res.render('viewtask', {
								"tasklist": task,
								"userlist": account,
								"projectlist": proj,
								"timesheetlist" : timesheet
							});
						});
					});
				});
			});
		}
	};
};