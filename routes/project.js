
var BSON = require('mongodb').BSONPure,
	tableName = 'Projects';

exports.add = function(db) {
	return function(req, res){

		var projName = req.body.projname,
			projDescription = req.body.description,
			projStartDate = req.body.startdate,
			projStatus = {"Name": req.body.status}
			projEstDuration = req.body.duration,
			userInfo = {
				username: req.session.currentUser.username, 
				_id: req.session.currentUser._id
			},
			project = { 
				"Name" : projName,
				"Description" : projDescription,
				"StartDate" : projStartDate,
				"Status" : projStatus,
				"Estimated Duration" : projEstDuration,
				"EnteredOn": new Date(),
				"CreatedBy": userInfo,
			}
		
		console.log("project\n", project);
		var collection =db.get(tableName);
		collection.insert(project, function(err, doc) {
			if(err){
				res.send("Psh what database");
			}
			else {
				console.log("Project inserted successful");
				res.location("dashboard");
				res.redirect("dashboard");
			}
			
		});
	}
}

exports.edit = function(db){
	return function(req, res){
		IsEnabled = false;
		if (req.body['delete']==='') {
			var project = { _id : BSON.ObjectID.createFromHexString(req.query._id) }
			var collection =db.get(tableName);
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
		} else {
			console.log('exports.project', req.query._id!=null ? req.query._id: "no value");
			console.log('req', req.body);
			var p_id = BSON.ObjectID.createFromHexString(req.query._id);
			var collection = db.get(tableName);
			var collection1 = db.get('Tasks');
			var collection2 = db.get('timesheets');
			var collection3 = db.get('accounts');
			if (req.body['enabler']==='') {
				console.log("Enabled");
				IsEnabled = true;
			} 
			console.log('IsEnabled', IsEnabled);
			collection.find({_id: p_id},{}, function(e, proj){
				collection1.find({Project: req.query._id},{}, function(e,task){
					var filter = [];
					for (var t in task)
						filter.push(task[t]._id);
					console.log('task filter', filter);		
					collection2.find({Task: {$in: filter}}, {}, function(e, timesheet) {
						filter = [];
						for (var t in timesheet)
							filter.push(BSON.ObjectID.createFromHexString(timesheet[t].user));
							//filter.push(timesheet[t].user);
						console.log('user filter', filter);		
						collection3.find({_id: {$in: filter}}, {}, function(e, account) {
							res.render('viewproject', {
								"projectlist": proj,
								"userlist": account,
								"tasklist": task,
								"timesheetlist" : timesheet,
								"IsEnabled" : IsEnabled,
								"currentUser": req.session.currentUser
							});
						});
					});			
				});
			});
		}
	};
};

exports.list = function(db){
	return function(req, res){
		var collection = db.get(tableName),
			collection1 = db.get('accounts'),
			collection2 = db.get('Tasks'),
			collection3 = db.get('Timesheets');
		var filter = {};
			
		
		collection.find({},{}, function(e, proj){
			collection1.find({},{}, function(e,account){
				collection2.find({}, {}, function(e, task) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('projects', {
							"projectlist": proj,
							"userlist": account,
							"tasklist": task,
							"timesheetlist" : timesheet,
							"currentUser": req.session.currentUser
						});
					});
				});
			});
		});
	};
};

exports.callNew = function(req, res){
	res.render('newproject', 
		{
			title: "Add a New Project",
			"currentUser": req.session.currentUser
		}
	);
};

exports.record = function(db){
	return function(req, res){
		console.log('project.record', req.query._id);
		var p_id = BSON.ObjectID.createFromHexString(req.query._id),
	 		collection = db.get(tableName);
			collection1 = db.get('Tasks');
			collection2 = db.get('Timesheets');
			collection3 = db.get('accounts');

		collection.find({_id: p_id},{}, function(e, proj){
			console.log("Next Request is: Project:", req.query._id);
			console.log("proj", proj);
			collection1.find({"Project": req.query._id},{}, function(e,task){
				var filter = [];
				for (var t in task)
					filter.push(task[t]._id);
				collection2.find({Task: {$in: filter}}, {}, function(e, timesheet) {
					filter = [];
					for (var t in timesheet)
						filter.push(BSON.ObjectID.createFromHexString(timesheet[t].user));				
					collection3.find({_id: {$in: filter}}, {}, function(e, account) {
						req.session.oldValues = proj;
						req.session.curRecord = {
							"table": tableName,
							"Record": proj
							//, "_id" : p_id, "Name": proj.Name
						}
						console.log('curRecord', req.session.curRecord);
						console.log('oldRecord', proj);
						res.render('viewproject', {
							"projectlist": proj,
							"tasklist": task,
							"timesheetlist" : timesheet,
							"userlist": account,
							"IsEnabled": false,
							"currentUser": req.session.currentUser
						});
					});
				});			
			});
		});
	};
};