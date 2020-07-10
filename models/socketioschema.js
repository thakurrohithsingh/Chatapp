var mongoose = require("mongoose");

var SocketIoSchema = new mongoose.Schema({
    sendersocketId: {
        type: String
    },
    receiviersocketId: {
        type: String
    },
    message: {
        type: String
    },
    user: {
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
        }
    }
});

module.exports = mongoose.model("SocketIO", SocketIoSchema);
