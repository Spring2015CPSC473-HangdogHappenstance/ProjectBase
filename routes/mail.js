exports.list = function(req, res){
	var someMail = [
	{"From": "Chris Danan", 
	 "To": "Mario Andrade", 
	 "Date": "April 1, 2015", 
	 "Message": "You guys totally sucked on that last exam!"},
	{"From": "Sarah", 
	 "To": "Mario Andrade", 
	 "Date": "April 1, 2015", 
	 "Message": "I need a t-t-time machine!"},
	{"From": "Cornflower Blue",
	 "To": "Mario Andrade", 
	 "Date": "April 1, 2015", 
	 "Message": "Why do you dislike me so much?"},
	{"From": "Yuri Van Steenburg", 
	 "To": "Mario Andrade", 
	 "Date": "April 1, 2015", 
	 "Message": "I finished assignment 6 on my own. You're off the group!"},
	{"From": "Chris Danan", 
	 "To": "Mario Andrade", 
	 "Date": "April 1, 2015", 
	 "Message": "April Fools!"}];
	res.render('mail', {title: 'Mailbox - Show your friends that you exist', mail: someMail});
}

exports.compose = function(req, res) {
	var someFriendsList = [{"Name": "Chris Danan"},{"Name": "Yuri Van Steenburg"},{"Name": "Sarah Lee"}];
	res.render('compose', {title: 'Mailbox - Compose A Message', friends: someFriendsList});
}