const { Schema, model } = require("mongoose");
const ObjectId = Schema.ObjectId

//Message Schema 
messageSchema = Schema({
    title: {
        type: String,
        trim: true,
        default: "Title"
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: ObjectId,
        ref: "User"
    }
})


module.exports = model("Message", messageSchema)
