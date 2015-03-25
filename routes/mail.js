
var BSON = require('mongodb').BSONPure,
	tableName = 'messages';

var someMail = [
	{"From": "Chris",
	 "Friend_id" : "1234", 
	 "To": "Mario Andrade",
	 "Subject" : "The Test", 
	 "Date" : "04/01/15",
	 "Time" : "7:00:00 PM",
	 "Body" : [
	 			{"friend_username" : "You guys totally sucked on that last exam! April Fools!"},
	 			{"username" : "We did our best D=<br/>That's not very nice you know."},
	 			{"friend_username" : "April Fools! We'll study harder next time, so I can get a 150% on it ;)"}
	 ],
	 "Read" : false
	},
	{"From": "Sarah", 
	 "Friend_id" : "5678",
	 "To": "Mario Andrade", 
	 "Subject" : "Don't ask!",
	 "Date": "04/01/15",
	 "Time" : "6:00:00 PM", 
	 "Body" : [
	 			{"friend_username" : "I need a t-t-time machine!"}
	 ],
	 "Read" : false
	},
	{"From": "CornflowerBlue",
	 "Friend_id" : "1111",
	 "To": "Mario Andrade",
	 "Subject" : "Why?",
	 "Date": "04/01/15",
	 "Time" : "5:40:10 PM", 
	 "Body": [
	 			{"friend_username" : "Why do you dislike me so much?"}
	 ],
	 "Read" : false
	},
	{"From": "Yuri",
	 "Friend_id" : "2222", 
	 "To": "Mario Andrade",  
	 "Date": "04/01/15",
	 "Subject" : "Assignment 6",
	 "Time" : "5:00:00 PM",
	 "Body": [
	 			{"friend_username" : "I finished assignment 6 on my own. You're off the group!"}
	 ],
	 "Read" : true
	},
	{"From": "Luigi",
	 "Friend_id" : "9876", 
	 "To": "Mario Andrade", 
	 "Subject" : "No Worries, Bro",
	 "Date": "04/01/15",
	 "Time" : "4:00:00 PM",
	 "Body": [
	 			{"friend_username" : "I saved the princess. No need to thank me."}
	 ],
	 "Read" : true
	}];

exports.list = function(db) {
	return function(req, res){
		var collection = db.get(tableName);
		collection.find({},{}, function(e, message){
			res.render('mail', {
				title: 'Mailbox - Show your friends that you exist', 
				mail: message,
				currentUser : req.session.currentUser
			});
		});
	};
};


exports.compose = function(req, res) {
	var someFriendsList = [
	{"Username": "Chris Danan"}];
	res.render('compose', {
		title: 'Mailbox - Compose A Message', 
		friends: someFriendsList,
		currentUser : req.session.currentUser
	});
}

exports.add = function(db) {
	return function(req, res){

		var userInfo = {
				username: req.session.currentUser.username, 
				_id: req.session.currentUser._id
			},
			message = {
				"From": userInfo.username,
	 			"Friend_id" : "2222", 
	 			"To": req.body.Username,  
	 			"Date": new Date(),
	 			"Subject" : req.body.Subject,
	 			"Time" : "5:00:00 PM",
	 			"Body": [
	 				{ "friend_username" : req.body.Message}
	 			],
	 			"Read" : false
			}

		console.log("message\n", message);
		var collection =db.get(tableName);
		collection.insert(message, function(err, doc) {
			if(err){
				res.send("There is no database!");
			}
			else {
				console.log("Project inserted successful");
				res.location("mail");
				res.redirect("mail");
			}
			
		});
	}
}

exports.query = function(req, res) {
	console.log(req.body);
	var object = someMail.forEach(function (values) {
		if (values.From === req.body.id) {
			return values;
		} else {
			return "Hello World";
		}

		console.log(object);
		
		//not working
		res.json(object);
	});
}