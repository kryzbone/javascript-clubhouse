const Message = require("../models/message")
const { temp } = require("../cache");



exports.index = (req, res) => {
    if(req.isAuthenticated()) return res.redirect("/dash")
    
    if(temp.indexMessages) return res.render("index", { data: temp.indexMessages })

    //fetch messages from the database
    Message.find({}, { title: 1, message: 1, date: 1, _id: 0 })
    .sort("-date")
    .exec((err, doc) => {
        if(err) return next(err)
       
        //on success
        temp.indexMessages = doc
        res.render("index", { data: doc })
    })
    
}