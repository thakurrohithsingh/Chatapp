var express = require("express");
var router = express.Router();
var Chat = require("../models/chatschema");
var User = require("../models/userschema");
var SocketIO = require("../models/socketioschema");
var middleware = require("../middleware/middlewareindex");
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
            //console.log("Userids = ", Userids);
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
                    SocketIO.find({}, function (err, foundchat) {
                        if (err) {
                            res.redirect("back");
                        } else {
                            for (var i = 0; i < foundchat.length; i++) {
                                if ((currentuserid == foundchat[i].user.senderid) && (receivierid == foundchat[i].user.receivierid)) {
                                    user = foundchat[i];
                                    break;
                                }
                            }
                            console.log("foundchat====", user);
                            res.render("users", { userids: Userids, user: founduser, chat: user, usernames: Usersname, currentuserid: currentuserid });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;