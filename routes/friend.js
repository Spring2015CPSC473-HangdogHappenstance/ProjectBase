/**
 * Created by zaephor on 3/21/15.
 */

/* List user's current friends */
exports.list = function(req, res){
    console.log(req);
    res.render('friend/list', { title: 'List of friends'  });
};
/* Display the find-people screen */
exports.find = function(req, res){
    console.log(req);
    res.render('friend/find', { title: 'Friend search prompt and results' });
};
/* Display recommended friends */
exports.discover = function(req, res){
    console.log(req);
    res.render('friend/discover', { title: 'Recommended friends/Discover friends' });
};