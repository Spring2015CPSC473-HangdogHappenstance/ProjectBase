
/*
 * GET home page.
 */


var BSON = require('mongodb').BSONPure;
var ImEnabled = false;

exports.index = function(req, res){
	req.session.curRecord = {};
	console.log(req.session.currentUser);
	if (req.session.currentUser!=undefined) {
  		res.render('buttons', 
  			{ 
  				title: req.session.currentUser.username, 
  				currentUser : req.session.currentUser
  			}
  		);
  	} else {
  		req.session.currentUser = {};
  		res.render('login', { title: 'Group Project Title' });
  	}
};

exports.dashboard = function(db){
	return function(req, res){
		req.session.curRecord = {};
		var collection = db.get('accounts');
		var collection1 = db.get('Projects');
		var collection2 = db.get('Tasks');
		var collection3 = db.get('Timesheets');
		
		collection.find({},{}, function(e, docs){
			res.render('dashboard', {
				currentUser : req.session.currentUser
			});
		});
	};
};


