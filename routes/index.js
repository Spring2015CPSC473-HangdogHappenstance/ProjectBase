
/*
 * GET home page.
 */


var BSON = require('mongodb').BSONPure;
var ImEnabled = false;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.testpage = function(req, res){
	res.render('testpage', {title: 'My name is not Radley'});
};

//This pulls from the database
//for the callbacks to work the callbacks from each collection must be in each other
//Here are callbacks for 2 collections the empty {} are for fields that you want searched.
exports.userlist = function(db){
	return function(req, res){
		var collection = db.get('accounts');
		var collection1 = db.get('testcollection');
		
		collection.find({},{}, function(e, docs){
			collection1.find({},{}, function(e,proj){
				res.render('userlist', {
					"userlist": docs,
					"projlist": proj
				});
			});
		});
	};
};

exports.dashboard = function(db){
	return function(req, res){
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



exports.newuser = function(req, res){
	res.render('newuser', {title: "Add a New User"});
};

exports.adduser= function(db){
	return function(req, res){
		
		var userName = req.body.username;
		var userEmail = req.body.useremail;
		var userPassword = req.body.userpassword;
		
		var collection =db.get('accounts');
		
		collection.insert({
			"username": userName,
			"email": userEmail,
			"password": userPassword
		}, function(err, doc) {
			if(err){
				res.send("Psh what database");
			}
			else {
				res.location("userlist");
				res.redirect("userlist");
			}
			
		});
	}
}

exports.newproject = function(req, res){
	res.render('newproject', {title: "Add a New Project"});
};

exports.editproject = function(req, res){
	return function(req, res){
		console.log('exports.project', req.query._id);
		var p_id = BSON.ObjectID.createFromHexString(req.query._id);
		var collection = db.get('Projects');
		var collection1 = db.get('accounts');
		var collection2 = db.get('Tasks');
		var collection3 = db.get('Timesheets');
		
		collection.find({_id: p_id},{}, function(e, proj){
			collection1.find({},{}, function(e,account){
				collection2.find({Project: req.query._id}, {}, function(e, task) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('editproject', {
							"projectlist": proj,
							"userlist": account,
							"tasklist": task,
							"timesheetlist" : timesheet
						});
					});
				});			
			});
		});
	};
};

exports.addproject = function(db) {
	return function(req, res){
		
		var projName = req.body.projname;
		var projDescription = req.body.description;
		var projStartDate = req.body.startdate;
		var projStatus = { "Level" : "1", "Name" : "Initialized" };
		var projEstDuration = req.body.duration;
		var project = { 
			"Name" : projName,
			"Description" : projDescription,
			"StartDate" : projStartDate,
			"Status" : projStatus,
			"Estimated Duration" : projEstDuration
		}
		
		console.log("project\n", project);
		
		var collection =db.get('Projects');
		
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

exports.projects = function(db){
	return function(req, res){
		var collection = db.get('Projects');
		var collection1 = db.get('accounts');
		var collection2 = db.get('Tasks');
		var collection3 = db.get('Timesheets');
		
		collection.find({},{}, function(e, proj){
			collection1.find({},{}, function(e,account){
				collection2.find({}, {}, function(e, task) {
				collection3.find({}, {}, function(e, timesheet) {
						res.render('projects', {
							"projectlist": proj,
							"userlist": account,
							"tasklist": task,
							"timesheetlist" : timesheet
						});
					});
				});
			});
		});
	};
};

exports.project = function(db){
	return function(req, res){
		console.log('exports.project', req.query._id);
		var p_id = BSON.ObjectID.createFromHexString(req.query._id);
		var collection = db.get('Projects');
		var collection1 = db.get('accounts');
		var collection2 = db.get('Tasks');
		var collection3 = db.get('Timesheets');
		console.log("req", req);
		collection.find({_id: p_id},{}, function(e, proj){
			collection1.find({},{}, function(e,account){
				collection2.find({Project: req.query._id}, {}, function(e, task) {
					collection3.find({}, {}, function(e, timesheet) {
						res.render('viewproject', {
							"projectlist": proj,
							"userlist": account,
							"tasklist": task,
							"timesheetlist" : timesheet
						});
					});
				});			
			});
		});
	};
};

exports.newtask = function(req, res){
	res.render("newtask", {title: "Add a New Task"});
};

exports.addtask = function(db) {
	return function(req, res){
		
		var taskName = req.body.taskname;
		var Status = { "Level" : "1", "Name" : "Initialized" }
		var projEstDuration = req.body.duration;
		//var project = {"$ref": "Projects", "$id": ObjectId('5341295ec3967cfa60000001')}
		var project = "5341295ec3967cfa60000001";
		var task = {
			"Name" : taskName,
			"EstimatedDuration" : projEstDuration,
			"Status" : Status,
			"Project" : project
		}
		
		console.log("task\n", task);
		
		var collection =db.get('Tasks');
		
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

exports.tasks = function(db){
	return function(req, res){
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

exports.newtimesheet = function(req, res){
	res.render("newtimesheet", {title: "Add a New Timesheet"});
};

exports.addtimesheet = function(db) {
	return function(req, res){
		
		var timesheetName = req.body.timesheetname,
			start = req.body.starttime,
			end = req.body.endtime,
			workDescription = req.body.description,
			Status = { "Level" : "1", "Name" : "Initialized" },
			task = "53423597c13ac37362000001",
			user = "53411393969cb15e5f000001",
			timesheet = {
				"Name" : timesheetName,
				"Work Description" : workDescription,
				"Start Time" : start,
				"End Time" : end,
				"Status" : Status,
				"Task" : task,
				"user" : user
			}
		
		console.log("timesheet\n", timesheet);
		
		var collection =db.get('Timesheets');
		
		collection.insert(timesheet, function(err, doc) {
			if(err){
				res.send("Psh what database");
			}
			else {
				console.log("Timesheet inserted successful");
				res.location("dashboard");
				res.redirect("dashboard");
			}
			
		});
	}
}

exports.timesheets = function(db){
	return function(req, res){
		var collection = db.get('Timesheets');
		var collection1 = db.get('accounts');
		var collection2 = db.get('Projects');
		var collection3 = db.get('Tasks');
		
		collection.find({},{}, function(e, timesheet){
			collection1.find({},{}, function(e,account){
				collection2.find({}, {}, function(e, proj) {
				collection3.find({}, {}, function(e, task) {
						res.render('timesheets', {
							"timesheetlist" : timesheet,
							"userlist": account,
							"projectlist": proj,
							"tasklist": task
							
						});
					});
				});
			});
		});
	};
};

exports.test1 = function(req, res){
	res.render('test1', {title: 'radley'});
};
