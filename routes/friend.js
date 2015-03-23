/**
 * Created by zaephor on 3/21/15.
 */

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