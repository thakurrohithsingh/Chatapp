var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema1 = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema1.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema1);