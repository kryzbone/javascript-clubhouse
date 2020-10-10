const Message = require("../models/message");


exports.dash = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    //fetch messages from the database
    Message.find({})
    .sort({date: -1})
    .populate("author", "firstName lastName")
    .exec((err, doc) => {
        if(err) return next(err)
       
        //on success
        res.render("dash", { data: doc })
    })
  
}