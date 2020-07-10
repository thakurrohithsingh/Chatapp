var Chat = require("../models/chat");
var User = require("../models/user");

var middlewareObj123 = {};

middlewareObj123.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = middlewareObj123;
