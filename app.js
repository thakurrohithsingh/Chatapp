var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    dateTime = require("simple-datetime-formater"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Chat = require("./models/chat");



app.use(express.static(__dirname + "/public"));
//requiring routes
var loginRoutes = require("./routes/login"),
    chatRoutes = require("./routes/chat");

mongoose.connect("mongodb://localhost/chatapp", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var user;
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    user = req.user;
    //console.log("res.locals.currentUser", res.locals.currentUser);
    next();
});

app.use("/", loginRoutes);
app.use("/chat", chatRoutes);


//require the socket.io module
var socket = require("socket.io");
var port = 8000;
var server = app.listen(port, function () {
    console.log("The chatapp Server Has Started! at port no " + port);
});
var io = socket(server);

io.on("connection", function (socket) {
    console.log("user connected!!!", socket.id);
    socket.on("chat", function (data) {
        console.log("data", data);
        // var username = user;
        // //console.log("username=======", username);
        // var newMessage = new Chat(
        //     {
        //         message: data.message,
        //         sender: username
        //     });
        //console.log("newMessage", newMessage);
        io.sockets.emit("chat", data);
    });
    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


