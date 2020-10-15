const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const { temp, emitter } = require("../cache")



//new post get handler
exports.postGet = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    if(req.user.status === "stale") return res.redirect("/test")

    res.render("messageForm")
}  


//new message post handler
exports.postPost = [
    //validate data from user
    body("title").isString().trim().escape(),
    body("message").notEmpty().withMessage("You can't do that my friend. Enter message now").isString().trim().escape(),

    (req, res, next) => {
        //check if user is Logged in
        if(!req.isAuthenticated()) return res.redirect("/login")

        //check for validation errors
        const error = validationResult(req)

        if(!error.isEmpty()) return res.render("messageForm", { errors: error.array(), data: req.body  })

        
        //create new message
        const message = Message({
            title: req.body.title || "Title",
            message: req.body.message,
            author: req.user._id
        })

        message.save()
        .then((doc) => {
            emitter.emit("flushMessages")
            temp[doc._id] = doc
            res.redirect("/dash")
        })
        .catch(next)
    }
]