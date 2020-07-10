var express = require("express");
var router = express.Router();
var Pusher = require('pusher');
var passport = require("passport");
var User = require("../models/userschema");
var SocketIO = require("../models/socketioschema");
var Usersname = [];
var Userids = [];

// Create an instance of Pusher
const pusher = new Pusher({
  appId: '1031179',
  key: 'ebe85964f2ab0f1bcdc6',
  secret: '5861fc501f0dd4619b70',
  cluster: 'ap2',
  encrypted: true
});

//root route
router.get("/", function (req, res) {
  //console.log("router gets activated", req.user);
  if (req.user) {
    var currentuserid = req.user._id;
    res.redirect("/chat/" + currentuserid);
  } else {
    res.redirect("/login");
  }
});

// show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  //console.log("username", newUser);
  //console.log("password", req.body.password);
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log("err", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      console.log("user authenticated=======");
      res.redirect("/");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    failureRedirect: "/login"
  }), function (req, res) {
  });

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  var user = req.user;
  console.log("user**********", user);
  res.redirect("/login");
});

router.get("/chat/:currentuserid", function (req, res) {
  var currentuserid = req.params.currentuserid;
  User.find({}, function (err, foundusers) {
    if (err) {
      res.redirect("back");
    } else {
      for (var i = 0; i < foundusers.length; i++) {
        if (currentuserid == foundusers[i]._id) {
          var currentusername = foundusers[i].username;
        }
        Userids[i] = foundusers[i]._id;
        Usersname[i] = foundusers[i].username;
      }
      res.render("index", { userids: Userids, users: foundusers, usernames: Usersname, currentuserid: currentuserid, currentusername: currentusername });
    }
  });
});

router.get("/chat/:currentuserid/:receivierid", function (req, res) {
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
            if (currentuserid == foundusers[i]._id) {
              var currentusername = foundusers[i].username;
            }
            Userids[i] = foundusers[i]._id;
            Usersname[i] = foundusers[i].username;
          }
          res.render("users", { userids: Userids, user: founduser, usernames: Usersname, currentuserid: currentuserid, currentusername: currentusername });
        }
      });
    }
  });
});

router.post("/video-chat/:currentuserid/pusher/auth", (req, res) => {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id:
      Math.random()
        .toString(36)
        .slice(2) + Date.now()
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});



router.get("/video-chat/:currentuserid/:receivierid", function (req, res) {
  var currentuserid = req.params.currentuserid;
  var receivierid = req.params.receivierid;
  var user;
  User.findById(receivierid, function (err, founduser) {
    if (err) {
      res.redirect('back');
    } else {
      User.find({}, function (err, foundusers) {
        if (err) {
          res.redirect('back');
        } else {
          for (var i = 0; i < foundusers.length; i++) {
            if (currentuserid == foundusers[i]._id) {
              var currentusername = foundusers[i].username;
            }
            Userids[i] = foundusers[i]._id;
            Usersname[i] = foundusers[i].username;
          }
          res.render("videocall", { userids: Userids, user: founduser, usernames: Usersname, currentuserid: currentuserid, currentusername: currentusername });
        }
      });
    }
  });
});



router.get("/chat/userprofile/:user", function (req, res) {
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