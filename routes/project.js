exports.enabled = false;

exports.newproject = function(req, res){
	res.render('newproject', {title: "Add a New Project"});
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