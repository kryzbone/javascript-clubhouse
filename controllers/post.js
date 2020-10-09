const { body, validationResult } = require("express-validator");
const Message = require("../models/message");

let temp = {};


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
    body("message").notEmpty().withMessage("You can't do that my friend").isString().trim().escape(),

    (req, res, next) => {
        //cache user info
        temp.msg = req.body

        //check if user is Logged in
        if(!req.isAuthenticated()) return res.redirect("/login")

        //check for errors
        const error = validationResult(req)

        if(!error.isEmpty()) return res.render("messageForm", { errors: error.array(), data: req.body  })

        

        //create new message
        const message = Message({
            title: req.body.title,
            message: req.body.message,
            author: req.user._id
        })

        console.log(message)

    }
]