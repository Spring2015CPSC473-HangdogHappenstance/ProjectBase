/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
/**
 * Created by Eric on 3/21/15.
 */
var BSON = require("mongodb").BSONPure;
var _ = require("underscore");

/* The ServerSide API connection to get appropriate data for all the below chunks */
exports.api = function(db) {
  "use strict";
  return function(req, res) {
    if (typeof req.session.currentUser === "undefined") {
      res.json({
        error: "No session"
      });
    } else {
      var users = db.get("accounts");
      var likes = db.get("likes");
//      var categories = ["Friends", "Books", "Movies", "Searches"];

      var reply = {
        existingfriends: function(userid, offset, limit) {
          // Get list of friend objects, sort them according to SORT, start at the OFFSET and return LIMIT many afterwards
          //var temp = users.slice(offset, offset + limit);
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          users.findOne({
            "_id": {$in: [p_id]}
          }, "friends friendspending", function(err, friendslists) { // Get logged in user's friends
            var friends = [];
            if (typeof friendslists.friends !== "undefined") {
              _.each(friendslists.friends, function(friendid) {
                friends.push(BSON.ObjectID.createFromHexString(friendid)); // Convert all friend strings to hex items
              });
            }
            users.find({
              "_id": {
                $in: _.uniq(friends, false)
              },
              "friends": p_id.toString()
            }, "username", function(err, userfriends) { // Now get all friends usernames
              // Have list of users, plus logged in user. Get all relevent user's likes
              if (typeof userfriends !== "undefined" && userfriends.length > 0) {
                var everyone = friendslists.friends;
                everyone.push(p_id.toString()); // Create object of all friends plus logged in user to search with
                likes.find( // Get all users likes
                  {
                    "userRec._id": {
                      $in: everyone
                    }
                  },
                  "category name userRec._id",
                  function(err, alllikes) {
                    // Have all matches's likes
                    var organizedLikes = {};
                    var organizedOutput = [];
                    _.each(alllikes, function(entry) { // reorganize and filter the likes to be easier to compare
                      if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                        organizedLikes[entry.userRec._id] = {};
                      }
                      if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                        organizedLikes[entry.userRec._id][entry.category] = [];
                      }
                      organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                    });
                    _.each(userfriends, function(entry) { // Cycle through the friends to compare their like rankings
                      organizedOutput.push({
                        _id: entry._id,
                        username: entry.username,
                        match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                      });
                    });
                    res.json(organizedOutput.slice(offset, offset + limit));
                    //                    res.json(userfriends.slice(offset,offset+limit));
                  });
                // res.json(userfriends.slice(offset,offset+limit));
              } else {
                res.json([{
                  _id: "error",
                  username: "This is awkward... Make some friends."
                }]);
              }
            });
          });
        },

        friendspending: function(userid, offset, limit) {
          // Get list of friend objects, sort them according to SORT, start at the OFFSET and return LIMIT many afterwards
          //var temp = users.slice(offset, offset + limit);
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          users.findOne({
            "_id": {
              $in: [p_id]
            }
          }, "friends friendspending", function(err, friendslists) { // Get logged in user's friends
            var friendspending = [];
            if (typeof friendslists.friendspending !== "undefined") {
              _.each(friendslists.friendspending, function(friendid) {
                friendspending.push(BSON.ObjectID.createFromHexString(friendid)); // Convert all friend strings to hex items
              });
            }
            users.find({
              "_id": {
                $in: _.uniq(friendspending, false)
              }
            }, "username", function(err, userfriends) { // Now get all friends usernames
              // Have list of users, plus logged in user. Get all relevent user's likes
              if (userfriends.length) {
                var everyone = friendslists.friendspending;
                everyone.push(p_id.toString()); // Create object of all friends plus logged in user to search with
                likes.find( // Get all users likes
                  {
                    "userRec._id": {
                      $in: everyone
                    }
                  },
                  "category name userRec._id",
                  function(err, alllikes) {
                    // Have all matches's likes
                    var organizedLikes = {};
                    var organizedOutput = [];
                    _.each(alllikes, function(entry) { // reorganize and filter the likes to be easier to compare
                      if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                        organizedLikes[entry.userRec._id] = {};
                      }
                      if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                        organizedLikes[entry.userRec._id][entry.category] = [];
                      }
                      organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                    });
                    _.each(userfriends, function(entry) { // Cycle through the friends to compare their like rankings
                      organizedOutput.push({
                        _id: entry._id,
                        username: entry.username,
                        match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                      });
                    });
                    res.json(organizedOutput.slice(offset, offset + limit));
                    //                    res.json(userfriends.slice(offset,offset+limit));
                  });
                // res.json(userfriends.slice(offset,offset+limit));
              } else {
                res.json([{
                  _id: "error",
                  username: "Well... This is awkward too, maybe someone will eventually ask to be your friend?"
                }]);
              }
            });
          });
        },

        findfriends: function(username, offset, limit) {
          // Get list of users related to username, sort according to SORT, start at the OFFSET and return LIMIT many afterwards
          //var temp = users.slice(offset, offset + limit);
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          users.find({
            "_id": {
              $nin: [p_id]
            },
            username: {
              $regex: new RegExp(username.toLowerCase(), "i")
            }
          }, "username", function(err, matches) {
            // Have list of users, plus logged in user.
            if (matches.length) {
              var everyone = [p_id.toString()];
              _.each(matches, function(entry) {
                everyone.push(entry._id.toString());
              });
              likes.find( // Get all users likes
                {
                  "userRec._id": {
                    $in: everyone
                  }
                },
                "category name userRec._id",
                function(err, alllikes) {
                  // Have all matches's likes
                  var organizedLikes = {};
                  var organizedOutput = [];
                  _.each(alllikes, function(entry) { // reorganize and filter the likes to be easier to compare
                    if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                      organizedLikes[entry.userRec._id] = {};
                    }
                    if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                      organizedLikes[entry.userRec._id][entry.category] = [];
                    }
                    organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                  });
                  _.each(matches, function(entry) { // Cycle through the friends to compare their like rankings
                    organizedOutput.push({
                      _id: entry._id,
                      username: entry.username,
                      match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                    });
                  });
                  res.json(organizedOutput.slice(offset, offset + limit));
                  //                  res.json(matches.slice(offset, offset + limit));
                });
              //res.json(matches.slice(offset, offset + limit));
            } else {
              res.json([{
                _id: "error",
                username: "No matches found."
              }]);
            }

          });
        },

        discoverfriends: function(userid, offset, limit) {
          // List of users should have high similarity rankings to logged in user... not sure on how to do that yet
          // Get list of users, sort according to SORT, start at OFFSET and return LIMIT many afterwards
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          users.findOne({
            "_id": {
              $in: [p_id]
            }
          }, "friends friendspending", function(err, friendslists) {
            var friends = [p_id];
            if (typeof friendslists.friends !== "undefined") {
              _.each(friendslists.friends, function(friendid) {
                friends.push(BSON.ObjectID.createFromHexString(friendid));
              });
            }
            // Now pull all non-friend users
            users.find({
              "_id": {
                $nin: _.uniq(friends, false)
              }
            }, "username", function(err, newpeople) {
              // Have list of users, plus logged in user.
              if (newpeople.length) {
                var everyone = [p_id.toString()];
                _.each(newpeople, function(entry) {
                  everyone.push(entry._id.toString());
                });
                likes.find( // Get all users likes
                  {
                    "userRec._id": {
                      $in: everyone
                    }
                  },
                  "category name userRec._id",
                  function(err, alllikes) {
                    // Have all matches's likes
                    var organizedLikes = {};
                    var organizedOutput = [];
                    _.each(alllikes, function(entry) { // reorganize and filter the likes to be easier to compare
                      if (typeof organizedLikes[entry.userRec._id] === "undefined") {
                        organizedLikes[entry.userRec._id] = {};
                      }
                      if (typeof organizedLikes[entry.userRec._id][entry.category] === "undefined") {
                        organizedLikes[entry.userRec._id][entry.category] = [];
                      }
                      organizedLikes[entry.userRec._id][entry.category].push(entry.name);
                    });
                    _.each(newpeople, function(entry) { // Cycle through the friends to compare their like rankings
                      organizedOutput.push({
                        _id: entry._id,
                        username: entry.username,
                        match: utility.compareLikes(organizedLikes[p_id.toString()], organizedLikes[entry._id])
                      });
                    });
                    res.json(organizedOutput.slice(offset, offset + limit));
                    //                    res.json(newpeople.slice(offset,offset+limit));
                  });
                //res.json(newpeople.slice(offset,offset+limit));
              } else {
                res.json([{
                  _id: "error",
                  username: "You're friends with everyone already"
                }]);
              }
            });
          });
        },
        deletefriend: function(friendid) {
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          var f_id = BSON.ObjectID.createFromHexString(friendid);

          // remove relationship between logged in user and the friendid in friends and frendspending, this is annoyingly easier than adding a friend
          users.update({
            "_id": {
              $in: [p_id, f_id]
            }
          }, {
            $pullAll: {
              friends: [p_id.toString(), f_id.toString()],
              friendspending: [p_id.toString(), f_id.toString()]
            }
          }, {
            upsert: false,
            multi: true
          });
          // Poor error checking, but not yet sure how to handle verifying both of the above steps before returning a value in async
          return {
            result: "deleted",
            error: "none"
          };
        },
        addfriend: function(friendid) {
          // Create relationship between logged in user and the friendid
          var p_id = BSON.ObjectID.createFromHexString(req.session.currentUser._id);
          var f_id = BSON.ObjectID.createFromHexString(friendid);
          // Find logged in user, add friendID to friends
          users.findAndModify({
            "_id": {
              $in: [p_id]
            }
          }, {
            $addToSet: {
              friends: f_id.toString()
            }
          }, {
            upsert: false
          });
          // Find friend user, add logged in user's ID to pending list
          users.update({
            "_id": {
              $in: [f_id]
            }
          }, {
            $addToSet: {
              friendspending: p_id.toString()
            }
          }, {
            upsert: false
          });
          // Check if both users have "approved" or "added" one another
          // If they have, remove from friendspending list. We confirm that friendid is part of the friends list just incase of bazaar errors(since it wouldn't have matched otherwise)
          users.update({
            "_id": {
              $in: [p_id]
            },
            "friends": {
              $in: [f_id.toString()]
            },
            "friendspending": {
              $in: [f_id.toString()]
            }
          }, {
            $pullAll: {
              friendspending: [p_id.toString(), f_id.toString()]
            },
            $addToSet: {
              friends: f_id.toString()
            }
          }, {
            upsert: false,
            multi: true
          });
          users.update({
            "_id": {
              $in: [f_id]
            },
            "friends": {
              $in: [p_id.toString()]
            },
            "friendspending": {
              $in: [p_id.toString()]
            }
          }, {
            $pullAll: {
              friendspending: [p_id.toString(), f_id.toString()]
            },
            $addToSet: {
              friends: p_id.toString()
            }
          }, {
            upsert: false,
            multi: true
          });
          // Poor error checking, but not yet sure how to handle verifying both of the above steps before returning a value in async
          return {
            result: "added",
            error: "none"
          };
        }
      };

      var utility = {
        compareLikes: function(data, data2) {
          var categories = [];
          var replydata = {};
          _.each(Object.keys(data), function(entry) {
            categories.push(entry);
          });
          _.each(Object.keys(data2), function(entry) {
            categories.push(entry);
          });
          categories.sort();
          categories = _.uniq(categories, true);
          _.each(categories, function(entry) {
            var common = _.intersection(data[entry], data2[entry]);
            if (typeof data[entry] !== "undefined" && typeof data2[entry] !== "undefined") {
              var tempsize = 0;
              if (data[entry].length >= data2[entry].length) {
                tempsize = data[entry].length;
              } else {
                tempsize = data2[entry].length;
              }
              replydata[entry] = Math.round((common.length / tempsize) * 100);
            } else {
              if (typeof data[entry] !== "undefined") {
                replydata[entry] = Math.round((common.length / data[entry].length) * 100);
              } else if (typeof data2[entry] !== "undefined") {
                replydata[entry] = Math.round((common.length / data2[entry].length) * 100);
              } else {
                replydata[entry] = 0;
              }
            }
          });
          return replydata;
        }
      };

      var action = req.params.action.toLowerCase();
      if (typeof reply[action] !== "undefined") {
        // Get logged in user's #id number
        var extra = req.session.currentUser._id; // TODO: loggedInUserID, should be pulled from user session somewhere
        if (typeof req.body.extra !== "undefined") { // If API passsed an "extra" param, means that we need to search something specific
          /* for existingfriends and discoverfriends, extra should not be set, but for searches in findfriends, extra should be set */
          extra = req.body.extra;
        }
        if (reply[req.params.action.toLowerCase()].length === 3) {
          var temp = reply[req.params.action.toLowerCase()](extra, req.body.offset, req.body.limit);
          if (typeof temp === "object") {
            res.json(temp);
          }
        } else if (reply[req.params.action.toLowerCase()].length === 1) {
          res.json(reply[req.params.action.toLowerCase()](extra));
        } else {
          res.json({
            error: "Invalid request"
          });
        }
      } else { // api function doesn't exist
        res.json({
          error: "Invalid request"
        });
      }
    }
  };
};

/* List user's current friends */
exports.list = function(req, res) {
  "use strict";
  if (typeof req.session.currentUser === "undefined") {
    res.redirect(307, "/login");
  } else {
    res.render("friend/list", {
      title: "List of friends",
      currentUser: req.session.currentUser
    });
  }
};
/* List friend requests */
exports.pending = function(req, res) {
  "use strict";
  if (typeof req.session.currentUser === "undefined") {
    res.redirect(307, "/login");
  } else {
    res.render("friend/pending", {
      title: "Friend Requests",
      currentUser: req.session.currentUser
    });
  }
};
/* Display the find-people screen */
exports.find = function(req, res) {
  "use strict";
  if (typeof req.session.currentUser === "undefined") {
    res.redirect(307, "/login");
  } else {
    res.render("friend/find", {
      title: "Friend search prompt and results",
      currentUser: req.session.currentUser
    });
  }
};
/* Display recommended friends */
exports.discover = function(req, res) {
  "use strict";
  if (typeof req.session.currentUser === "undefined") {
    res.redirect(307, "/login");
  } else {
    res.render("friend/discover", {
      title: "Recommended friends/Discover friends",
      currentUser: req.session.currentUser
    });
  }
};