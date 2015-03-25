
/*
 * GET home page.
 */


var BSON = require('mongodb').BSONPure;
var ImEnabled = false;

exports.index = function(req, res){
	req.session.curRecord = {};
	console.log(req.session.currentUser);
	if (req.session.currentUser!=undefined) {
  		res.render('home', 
  			{ 
  				title: " Welcome " + req.session.currentUser.username, 
  				currentUser : req.session.currentUser
  			}
  		);
  	} else {
  		req.session.currentUser = {};
  		res.render('login', { title: 'Hangdog Happenstance' });
  	}
};

exports.likeStuff = function(db){
	return function(req, res){
		console.log("going into likeStuff")
		req.session.curRecord = {};
		var collection = db.get('accounts');
		var collection1 = db.get('likes');
		var collection2 = db.get('likes');
		var collection3 = db.get('Timesheets');
		
		collection.find({},{}, function(e, usr){
			collection1.find({"category":"Books"},{}, function(e, book){
				collection2.find({"category":"Movies"}, {}, function(e, movie) {
					collection3.find({}, {}, function(e, timesheet) {
						console.log(movie);
						res.render('likeStuff', {
							"dashboard": usr,
							"booklist": book,
							"movielist": movie,
							"timesheetlist" : timesheet,
							currentUser : req.session.currentUser,
							title: "Like Stuff"
						});
					});
				});
			});
		});
	};
};

exports.help = function(db) {
	return function(req, res){
		console.log("going into help")
		res.render('help', {
			currentUser : req.session.currentUser,
			title: 'Hangdog Help' 
		});
	};
}

exports.aboutUs = function(db) {
	return function(req, res){
		console.log("going into About Us")
		res.render('aboutUs', {
			currentUser : req.session.currentUser,
			title: 'Hangdog About Us' 
		});
	};
}

exports.mail = function(db) {
	return function(req, res){
		console.log("going into Mail")
		res.render('aboutUs', {
			currentUser : req.session.currentUser,
			title: 'Hangdog Mail' 
		});
	};
}
exports.friends = function(db) {
	return function(req, res){
		console.log("going into friends")
		res.render('aboutUs', {
			currentUser : req.session.currentUser,
			title: 'Hangdog friends' 
		});
	};
}