const Message = require("../models/message")



exports.index = (req, res) => {
    if(req.isAuthenticated()) return res.redirect("/dash")

    //fetch messages from the database
    Message.find({}, { title: 1, message: 1, date: 1, _id: 0 })
    .sort("-date")
    .exec((err, doc) => {
        if(err) return next(err)
       
        //on success
        res.render("index", { data: doc })
    })
    
}