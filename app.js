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

mongoose.connect("mongodb://localhost/chatapp2", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
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
var users = [];
var socketid12;
io.on("connection", function (socket) {
    console.log("user connected!!!", socket.id);
    socket.on("user_connected", function (data) {
        console.log("user_connected_data", data);
        users[data.senderid] = socket.id;
        //console.log("users_connected_array", users);
    });
    socket.on("send_message", function (data) {
        console.log("send_message_data", data);
        socketid12 = users[data.receivierid];
        console.log("socketid", socketid12);
        console.log("socketid type", typeof (socketid));
        var message = new Chat({
            socketId: socketid12,
            message: data.message,
            sender: data.sender,
            senderId: data.senderid,
            receivier: data.receivier,
            receivierId: data.receivierid
        });
        Chat.create(message, function (err, message_saved) {
            if (err) {
                console.log("err", err.message);
            }
            console.log("message_saved", message_saved);
        });
        io.to(socketid12).emit("new_message", data);
    });
    socket.on("typing", function (data) {
        //console.log("typingdata", data);
        var socketid1 = users[data.receiverid];
        io.to(socketid1).emit("typing", data);
    });
    socket.on('disconnect', () => {
        users = [];
        console.log('user disconnected');
    });
});


