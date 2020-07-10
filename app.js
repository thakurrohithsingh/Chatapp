var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    dateTime = require("simple-datetime-formater"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/userschema"),
    Chat = require("./models/chatschema"),
    SocketIO = require("./models/socketioschema");



app.use(express.static(__dirname + "/public"));
//requiring routes
var loginRoutes = require("./routes/loginroutes"),
    chatRoutes = require("./routes/chatroutes");

mongoose.connect("mongodb://localhost/chatapp3", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
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
var usersobj = {};
var usersarray = [];
var obj2 = {};
var obj3 = {};
var message = [];
var messageobj = {};
var socketid12;
var socketid1;
io.on("connection", function (socket) {
    console.log("user connected!!!", socket.id);
    socket.on("user_connected", function (data) {
        SocketIO.find({}, function (err, socketsfound) {
            if (err) {
                console.log("err", err.message);
            }
            else {
                //console.log("socketsfound=====", socketsfound);
                if (socketsfound.length > 0) {
                    var socketid;
                    for (var i = 0; i < socketsfound.length; i++) {
                        var socketsenderid = socketsfound[i].user.senderid;
                        var socketreceivierid = socketsfound[i].user.receivierid;
                        if ((socketsenderid == data.senderid) && (socketreceivierid == data.receivierid)) {
                            socketid = socketsfound[i]._id;
                            break;
                        }
                    }
                    console.log("socketid============", socketid);
                    if (socketid) {
                        SocketIO.findById(socketid, function (err, foundsocket) {
                            if (err) {
                                console.log("err", err.message);
                            } else {
                                var user12 = {
                                    senderid: foundsocket.user.senderid,
                                    sender: foundsocket.user.sender,
                                    receivier: foundsocket.user.receivier,
                                    receivierid: foundsocket.user.receivierid
                                };
                                var newData = {
                                    sendersocketId: socket.id,
                                    user: user12
                                };
                                SocketIO.findByIdAndUpdate(socketid, newData, { new: true }, function (err, socketupdated) {
                                    if (err) {
                                        console.log("err", err.message);
                                    } else {
                                        //console.log("updatedsocketid", socketupdated);
                                        usersobj = {
                                            senderid: socketupdated.user.senderid,
                                            sender: socketupdated.user.sender,
                                            sendersocketid: socketupdated.sendersocketId,
                                            receivierid: socketupdated.user.receivierid,
                                            receivier: socketupdated.user.receivier
                                        };
                                        usersarray.push(usersobj);
                                        //console.log("userobj *++***= ", usersobj);
                                        io.to(socket.id).emit("user_connected", usersobj);
                                    }
                                });
                            }
                        });
                    } else {
                        usersobj = {
                            sender: data.sender,
                            senderid: data.senderid,
                            sendersocketid: socket.id,
                            receivier: data.receivier,
                            receivierid: data.receivierid
                        }
                        usersarray.push(usersobj);
                        var user = {
                            senderid: data.senderid,
                            sender: data.sender,
                            receivier: data.receivier,
                            receivierid: data.receivierid

                        };
                        var NewSocketobj = {
                            sendersocketId: usersobj.sendersocketid,
                            user: user
                        }
                        SocketIO.create(NewSocketobj, function (err, socketcreated) {
                            if (err) {
                                console.log("err", err.message);
                            }
                            //console.log("socketscreated***********************************", socketcreated);
                            io.to(socket.id).emit("user_connected", usersobj);
                        });
                    }
                } else {
                    usersobj = {
                        sender: data.sender,
                        senderid: data.senderid,
                        sendersocketid: socket.id,
                        receivier: data.receivier,
                        receivierid: data.receivierid
                    }
                    usersarray.push(usersobj);
                    var user = {
                        senderid: data.senderid,
                        sender: data.sender,
                        receivier: data.receivier,
                        receivierid: data.receivierid

                    };
                    var NewSocketobj = {
                        sendersocketId: usersobj.sendersocketid,
                        user: user
                    }
                    SocketIO.create(NewSocketobj, function (err, socketcreated) {
                        if (err) {
                            console.log("err", err.message);
                        }
                        //console.log("socketscreated==========================", socketcreated);
                        io.to(socket.id).emit("user_connected", usersobj);
                    });
                }
            }
        });
    });
    socket.on("send_message", function (data) {
        //console.log("send_message_data", data);
        //console.log("users in send_message socket", usersarray);
        var chatobj = {};
        for (var i = 0; i < usersarray.length; i++) {
            if ((usersarray[i].senderid === data.receivierid) && (usersarray[i].receivierid == data.senderid)) {
                socketid12 = usersarray[i].sendersocketid;
                break;
            }
        }
        console.log("socketid12", socketid12);
        obj2 = {
            message: data.message,
            sendersocketid: data.sendersocketid,
            sender: data.sender,
            senderid: data.senderid,
            receiviersocketid: socketid12,
            receivier: data.receivier,
            receivierid: data.receivierid
        };
        //console.log("sending new message", obj2);
        SocketIO.findOne({ sendersocketId: obj2.sendersocketid }, function (err, onesocketfound) {
            if (err) {
                console.log("err", err.message);
            }
            console.log("onesocketfound=====", onesocketfound);
            SocketIO.findByIdAndUpdate(onesocketfound._id, { receiviersocketId: socketid12, message: obj2.message }, { new: true }, function (err, socketupdated) {
                if (err) {
                    console.log("err", err.message);
                }
                messageobj = {
                    message: obj2.message,
                    id: obj2.senderid,
                    username: obj2.sender
                };
                message.push(messageobj);
                console.log("socketupdated======", socketupdated);
            });
        });
        io.to(socketid12).emit("new_message", obj2);
    });
    socket.on("typing", function (data) {
        //console.log("typingdata", data);
        for (var i = 0; i < usersarray.length; i++) {
            if ((usersarray[i].senderid === data.receivierid) && (usersarray[i].receivierid == data.senderid)) {
                socketid1 = usersarray[i].sendersocketid;
                break;
            }
        }
        //console.log("socketid1", socketid1);
        obj3 = {
            sender: data.sender,
            senderid: data.senderid,
            sendersocketid: data.sendersocketid,
            receivier: data.receivier,
            receivierid: data.receivierid,
            receiviersocketid: socketid1
        }
        //console.log("typing.......", obj3);
        io.to(socketid1).emit("typing", obj3);
    });
    socket.on('disconnect', () => {
        // console.log("users in disconnecyted", usersarray);
        console.log('user disconnected');
    });
});


