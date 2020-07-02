var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema = new Schema(
    [
        {
            message: {
                type: String
            },
            sender: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
            }
        }
    ],
    {
        timestamps: true
    }
);

let Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
