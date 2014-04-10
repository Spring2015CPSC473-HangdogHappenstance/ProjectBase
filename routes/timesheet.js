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