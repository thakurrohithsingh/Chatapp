var express = require("express");
var router = express.Router();
var Chat = require("../models/chat");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function (req, res, next) {
    var Usersname = [];
    var Userids = [];
    User.find({}, function (err, users) {
        if (err) {
            res.redirect("back");
        } else {
            for (var i = 0; i < users.length; i++) {
                Userids[i] = users[i]._id;
                console.log("Useris = ", Userids[i]);
                Usersname[i] = users[i].username;
                //console.log("username = ", Usersname[i])
            }
        }
    });
    User.find({}, function (err, founduser) {
        if (err) {
            res.redirect("back");
        } else {
            Chat.find({}, function (err, chatfound) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("index", { userids: Userids, users: founduser, usernames: Usersname, chat: chatfound });
                }
            });
        }
    });
});
// router.get("/", middleware.isLoggedIn, function (req, res) {
//     var userid = req.user;
//     console.log("*************************");
//     console.log("userid", userid);
//     console.log("*******************************");

// });

// router.post("/:userid", function (req, res) {
//     var message = req.body.message;
//     var userid = req.params.userid;
//     var sender = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newChat = {
//         message: message,
//         sender: sender
//     }
//     Chat.create(newChat, function (err, newlycreated) {
//         if (err) {
//             console.log(err.message);
//             res.redirect("back");
//         } else {
//             console.log("newlycreated", newlycreated);
//             res.redirect("/chat");
//         }
//     });
// });


module.exports = router;