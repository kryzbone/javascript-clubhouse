const { Schema, model } = require("mongoose");


//user schema
userSchema = Schema({
    firstName : {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    lastName : {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "stale"],
        default: "stale"
    }, 
    admin: {
        type: Boolean,
        default: false
    }
})


//virtuals
userSchema.virtual("fullName")
.get(function() {
    return this.firstName + " " + this.lastName;
})


module.exports = model("User", userSchema)