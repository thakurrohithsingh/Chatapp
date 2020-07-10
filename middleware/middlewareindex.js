var Chat = require("../models/chatschema");
var User = require("../models/userschema");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log("dsbdjhbhjbfdhh");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;
