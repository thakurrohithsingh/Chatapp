var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema1 = new Schema(
    {
        socketId: {
            type: String
        },
        message: {
            type: String
        },
        sender: {
            type: String
        },
        senderId: {
            type: String
        },
        receivier: {
            type: String
        },
        receivierId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

let Chat = mongoose.model("Chat", chatSchema1);

module.exports = Chat;
