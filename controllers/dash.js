const Message = require("../models/message");
const { temp } = require("../cache");




exports.dash = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login");

    if(temp.dashMessages) return res.render("dash", { data: temp.dashMessages })

    //fetch messages from the database
    Message.find({})
    .sort({date: -1})
    .populate("author", "firstName lastName")
    .exec((err, doc) => {
        if(err) return next(err)
       
        //on success
        temp.dashMessages = doc;
        res.render("dash", { data: doc })
    })
  
}