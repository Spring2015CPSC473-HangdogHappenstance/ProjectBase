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