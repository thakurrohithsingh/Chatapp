var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    senderid: {
        type: String
    },
    sender: {
        type: String
    },
    receivierid: {
        type: String
    },
    receivier: {
        type: String
    },
    message: [
        {
            message: { type: String },
            username: { type: String },
            id: { type: String }
        }
    ]
});

let Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
