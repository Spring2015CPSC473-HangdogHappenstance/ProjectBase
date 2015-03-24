/**
 * Created by zaephor on 3/21/15.
 */

/* The API connection to get appropriate data for all the below chunks */
exports.api = function(req,res){
    var users = [
        {"id":1,"name":"UserA","match":{"TV":50}},
        {"id":2,"name":"UserB","match":{"Books":90}},
        {"id":3,"name":"UserC","match":{"Movies":10}},
        {"id":4,"name":"UserD","match":{"Sports":5}}
    ];
    var categories = ["Movies","TV","Books"];

    function getFriends(userid,offest,limit,sort){
        // Get list of friend objects, sort them according to SORT, start at the OFFSET and return LIMIT many afterwards
        var temp = users;
        return temp;
    }

    function findFriends(username,offset,limit,sort){
        // Get list of users related to username, sort according to SORT, start at the OFFSET and return LIMIT many afterwards
        var temp = users;
        return temp;
    }

    function discoverFriends(userid,offset,limit,sort){
        // List of users should have high similarity rankings to logged in user... not sure on how to do that yet
        // Get list of users, sort according to SORT, start at OFFSET and return LIMIT many afterwards
        var temp = users;
        return temp;
    }

    switch(req.params.action.toLowerCase()){
        case 'existingfriends':
            res.json(getFriends());
            break;
        case 'findfriends':
            res.json(findFriends());
            break;
        case 'discoverfriends':
            res.json(discoverFriends());
            break;
        default:
            res.json({error:"Invalid request"});
            break;
    }
};

/* List user's current friends */
exports.list = function(req, res){
    var someFriends = [{"id":1,"name":"UserA","match":{"Movies":90,"TV":70,"Books":10}},{"id":2,"name":"UserB","match":{"Movies":40,"TV":80,"Books":55}},{"id":3,"name":"UserC","match":{"Movies":10,"TV":10,"Books":10}}];
    res.render('friend/list', { title: 'List of friends', friends: someFriends });
};
/* Display the find-people screen */
exports.find = function(req, res){
    var somePeople = [{"id":1,"name":"UserA","match":{"Movies":100,"TV":95,"Books":80}},{"id":2,"name":"UserB","match":{"Movies":90,"TV":80,"Books":10}},{"id":3,"name":"UserC","match":{"Movies":80,"TV":10,"Books":1}}];
    res.render('friend/find', { title: 'Friend search prompt and results', results: somePeople });
};
/* Display recommended friends */
exports.discover = function(req, res){
    var somePeople = [{"id":1,"name":"UserA","match":{"Movies":100,"TV":95,"Books":80}},{"id":2,"name":"UserB","match":{"Movies":90,"TV":80,"Books":10}},{"id":3,"name":"UserC","match":{"Movies":80,"TV":10,"Books":1}}];
    res.render('friend/discover', { title: 'Recommended friends/Discover friends', results: somePeople });
};