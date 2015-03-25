/**
 * Created by zaephor on 3/21/15.
 */

var BSON = require('mongodb').BSONPure;
var ImEnabled = false;

/* The ServerSide API connection to get appropriate data for all the below chunks */
exports.api = function (req, res) {
    var users = [
        {"id": 1, "name": "UserA", "match": {"TV": 50}},
        {"id": 2, "name": "UserB", "match": {"Books": 90}},
        {"id": 3, "name": "UserC", "match": {"Movies": 10}},
        {"id": 4, "name": "UserD", "match": {"Sports": 5}}
    ];
    var categories = ["Movies", "TV", "Books"];

    var reply = {
        existingfriends: function (userid, offset, limit, sort) {
            // Get list of friend objects, sort them according to SORT, start at the OFFSET and return LIMIT many afterwards
            var temp = users;
            return temp;
        },

        findfriends: function (username, offset, limit, sort) {
            // Get list of users related to username, sort according to SORT, start at the OFFSET and return LIMIT many afterwards
            var temp = users;
            return temp;
        },

        discoverfriends: function (userid, offset, limit, sort) {
            // List of users should have high similarity rankings to logged in user... not sure on how to do that yet
            // Get list of users, sort according to SORT, start at OFFSET and return LIMIT many afterwards
            var temp = users;
            return temp;
        },
        deletefriend: function(friendid){
            return {result:"deleted",error:"none"};
        },
        addfriend: function(friendid){
            return {result:"added",error:"none"};
        }
    };

    var action = req.params.action.toLowerCase();
    if (typeof reply[action] != "undefined") {
//        console.log(req);
        // Get logged in user's #id number
        var extra = req.session.currentUser._id; // TODO: loggedInUserID, should be pulled from user session somewhere
        if (typeof req.body.extra !== "undefined") { // If API passsed an "extra" param, means that we need to search something specific
            /* for existingfriends and discoverfriends, extra should not be set, but for searches in findfriends, extra should be set */
            extra = req.body.extra;
        }
        if(reply[req.params.action.toLowerCase()].length == 4){
            res.json(reply[req.params.action.toLowerCase()](extra, req.body.offset, req.body.limit, 'default'));
        } else if(reply[req.params.action.toLowerCase()].length == 1) {
            res.json(reply[req.params.action.toLowerCase()](extra));
        } else {
            res.json({error: "Invalid request"});
        }
    } else { // api function doesn't exist
        res.json({error: "Invalid request"});
    }
};

/* List user's current friends */
exports.list = function (req, res) {
    if (typeof req.session.currentUser == "undefined") {
        res.redirect(307, "/login");
    } else {
        var someFriends = [{"id": 1, "name": "UserA", "match": {"Movies": 90, "TV": 70, "Books": 10}}, {
            "id": 2,
            "name": "UserB",
            "match": {"Movies": 40, "TV": 80, "Books": 55}
        }, {"id": 3, "name": "UserC", "match": {"Movies": 10, "TV": 10, "Books": 10}}];
        res.render('friend/list', {
            title: 'List of friends',
            friends: someFriends,
            currentUser: req.session.currentUser
        });
    }
};
/* Display the find-people screen */
exports.find = function (req, res) {
    if (typeof req.session.currentUser == "undefined") {
        res.redirect(307, "/login");
    } else {
        var somePeople = [{"id": 1, "name": "UserA", "match": {"Movies": 100, "TV": 95, "Books": 80}}, {
            "id": 2,
            "name": "UserB",
            "match": {"Movies": 90, "TV": 80, "Books": 10}
        }, {"id": 3, "name": "UserC", "match": {"Movies": 80, "TV": 10, "Books": 1}}];
        res.render('friend/find', {
            title: 'Friend search prompt and results',
            results: somePeople,
            currentUser: req.session.currentUser
        });
    }
};
/* Display recommended friends */
exports.discover = function (req, res) {
    if (typeof req.session.currentUser == "undefined") {
        res.redirect(307, "/login");
    } else {
        var somePeople = [{"id": 1, "name": "UserA", "match": {"Movies": 100, "TV": 95, "Books": 80}}, {
            "id": 2,
            "name": "UserB",
            "match": {"Movies": 90, "TV": 80, "Books": 10}
        }, {"id": 3, "name": "UserC", "match": {"Movies": 80, "TV": 10, "Books": 1}}];
        res.render('friend/discover', {
            title: 'Recommended friends/Discover friends',
            results: somePeople,
            currentUser: req.session.currentUser
        });
    }
};