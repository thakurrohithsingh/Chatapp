var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req, res) {
    res.redirect("/login");
});

// show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    console.log("username", newUser);
    console.log("password", req.body.password);
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log("err", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            console.log("user authenticated=======");
            res.redirect("/chat");
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
        successRedirect: "/chat",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});



module.exports = router;