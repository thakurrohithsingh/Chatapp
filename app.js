var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  Pusher = require('pusher'),
  dateTime = require("simple-datetime-formater"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/userschema"),
  Chat = require("./models/chatschema"),
  SocketIO = require("./models/socketioschema");


app.use(express.static(__dirname + "/public"));
//requiring routes
var loginandchatsRoutes = require("./routes/loginandchatroutes");

mongoose.connect("mongodb://localhost/chatapp4", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Create an instance of Pusher
const pusher = new Pusher({
  appId: '1031179',
  key: 'ebe85964f2ab0f1bcdc6',
  secret: '5861fc501f0dd4619b70',
  cluster: 'ap2',
  encrypted: true
});

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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", loginandchatsRoutes);


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
var messageobj = {};
var socketid12;
var socketid1;
var useronline = [];
io.on("connection", function (socket) {
  console.log("user connected!!!", socket.id);
  socket.on("user_connected", function (data) {
    SocketIO.find({}, function (err, socketsfound) {
      if (err) {
        console.log("err", err.message);
      }
      else {
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
                    Chat.findOne({
                      $or: [
                        {
                          $and: [
                            { senderid: socketupdated.user.senderid },
                            { receivierid: socketupdated.user.receivierid }
                          ]
                        },
                        {
                          $and: [
                            { senderid: socketupdated.user.receivierid },
                            { receivierid: socketupdated.user.senderid }
                          ]
                        }
                      ]
                    }, function (err, chatfound) {
                      if (err) {
                        console.log("err", err.message);
                      } else {
                        if (chatfound) {
                          //console.log("messags = ", chatfound);
                          //console.log("chat messsges length", chatfound.message.length);
                          var messages = chatfound.message;
                          //console.log("messages", messages);
                          usersobj = {
                            senderid: socketupdated.user.senderid,
                            sender: socketupdated.user.sender,
                            sendersocketid: socketupdated.sendersocketId,
                            receivierid: socketupdated.user.receivierid,
                            receivier: socketupdated.user.receivier,
                            Message: messages
                          };
                          usersarray.push(usersobj);
                          io.to(socket.id).emit("user_connected", usersobj);
                        }
                      }
                    });
                    usersobj = {
                      senderid: socketupdated.user.senderid,
                      sender: socketupdated.user.sender,
                      sendersocketid: socketupdated.sendersocketId,
                      receivierid: socketupdated.user.receivierid,
                      receivier: socketupdated.user.receivier
                    };
                    usersarray.push(usersobj);
                    //console.log("hdvhdvhdghgdf = ", usersarray);
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
            io.to(socket.id).emit("user_connected", usersobj);
          });
        }
      }
    });
  });
  socket.on("send_message", function (data) {
    //console.log("send_message_data", data);
    //console.log("users in send_message socket", usersarray);
    var message = [];
    var chatobj = {};
    //console.log("users array in send_message", usersarray);
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
    messageobj = {
      message: obj2.message,
      id: obj2.senderid,
      username: obj2.sender
    };
    //console.log("socketupdated======", socketupdated);
    Chat.findOne({
      $or: [
        {
          $and: [
            { senderid: obj2.senderid },
            { receivierid: obj2.receivierid }
          ]
        },
        {
          $and: [
            { senderid: obj2.receivierid },
            { receivierid: obj2.senderid }
          ]
        }
      ]
    }, function (err, chatfound) {
      if (err) {
        console.log("err", err.message);
      } else {
        //console.log("chat found===",chatfound);
        if (chatfound) {
          var messages = chatfound.message;
          //console.log("chat found message",messages);
          messages.push(messageobj);
          Chat.findByIdAndUpdate(chatfound._id, { message: messages }, { new: true }, function (err, chatupdated) {
            if (err) {
              console.log("err", err.message);
            }
            //console.log("chatupdated", chatupdated.message);
          });
        } else {
          message.push(messageobj);
          chatobj = {
            sender: obj2.sender,
            senderid: obj2.senderid,
            receivier: obj2.receivier,
            receivierid: obj2.receivierid,
            message: message
          };
          Chat.create(chatobj, function (err, chatcreated) {
            if (err) {
              console.log("err", err.message);
            }
            //console.log("chatcreated", chatcreated);
          });
        }
      }
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


