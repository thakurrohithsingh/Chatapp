var express = require("express");
var router = express.Router();
var Chat = require("../models/chatschema");
var User = require("../models/userschema");
var Usersname = [];
var Userids = [];


router.get("/", function (req, res, next) {
  var currentuserid = req.user._id;
  res.redirect("/chat/" + currentuserid);
});

router.get("/:currentuserid", function (req, res) {
  var currentuserid = req.params.currentuserid;
  User.find({}, function (err, foundusers) {
    if (err) {
      res.redirect("back");
    } else {
      for (var i = 0; i < foundusers.length; i++) {
        for (var i = 0; i < foundusers.length; i++) {
          Userids[i] = foundusers[i]._id;
          Usersname[i] = foundusers[i].username;
        }
      }
      console.log("Userids = ", Userids);
      //onsole.log("usernames = ", Usersname);
      res.render("index", { userids: Userids, users: foundusers, usernames: Usersname, currentuserid: currentuserid });
    }
  });
});

router.get("/:currentuserid/:receivierid", function (req, res) {
  var currentuserid = req.params.currentuserid;
  var receivierid = req.params.receivierid;
  var user;
  //console.log("currentuserid", currentuserid);
  //console.log("receivierid", receivierid);
  User.findById(receivierid, function (err, founduser) {
    if (err) {
      res.redirect('back');
    } else {
      User.find({}, function (err, foundusers) {
        if (err) {
          res.redirect('back');
        } else {
          for (var i = 0; i < foundusers.length; i++) {
            for (var i = 0; i < foundusers.length; i++) {
              Userids[i] = foundusers[i]._id;
              Usersname[i] = foundusers[i].username;
            }
          }
          res.render("users", { userids: Userids, user: founduser, usernames: Usersname, currentuserid: currentuserid });
        }
      });
    }
  });
});

router.get("/userprofile/:user", function (req, res) {
  var user = req.params.user;
  User.findById(user, function (err, founduser) {
    if (err) {
      res.redirect("back");
    } else {
      console.log("founduser", founduser);
      res.redirect("/" + user);
    }
  });
});

module.exports = router;