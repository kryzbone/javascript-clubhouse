const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const { temp, emitter } = require("../cache")



//message edit get handler
exports.messageEdit =  (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    const id = req.params.id;
    
    //check cache for data
    if(temp[id]) return res.render("messageForm", { data: temp[id] })

    Message.findById(id)
    .exec((err, doc) => {
        if(err) return next(err)

        //if message is not available
        if(doc == null) {
            const err = Error("Message Not Found")
            err.status = 404
            next(err)
        }

        //on success
        temp[id] = doc
        res.render("messageForm", { data: doc  })
    })

}


//message edit post handler
exports.messageEditPost = [
    //validate data from user
    body("title").isString().trim().blacklist("<>"),
    body("message").notEmpty().withMessage("You can't do that my friend").isString().trim().blacklist("<>"),

    
    (req, res, next) => {
        if(!req.isAuthenticated()) return res.redirect("/login")

        const id = req.params.id;

        //check for errors
        const error = validationResult(req)
        if(!error.isEmpty()) return res.render("messageForm", { errors: error.array(), data: req.body  })

        //update message
        Message.findById(id, (err, doc) => {
            if(err) return next(err);

            //if message is not available
            if(doc == null) {
                const err = Error("Message Not Found")
                err.status = 404
                next(err)
            }

            //on success
            doc.title = req.body.title || "Title"
            doc.message = req.body.message
            doc.save((err, doc) => {
                if(err) next(err)

                //on success
                emitter.emit("flushMessages")
                temp[id] = doc
                res.redirect("/dash")
            })
        })
    }
]


//message delete get handler
exports.messageDelete = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")
    
    const id = req.params.id

    //check cache for data
    if(temp[id]) return res.render("messageDelete", { data: temp[id] })

    Message.findById(id)
    .exec((err, doc) => {
        if(err) return next(err)

        //if message is not available
        if(doc == null) {
            const err = Error("Message Not Found")
            err.status = 404
            next(err)
        }

        //on success
        res.render("messageDelete", { data: doc  })
    })
}



//message delete post handler
exports.messageDeletePost = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    const author = req.body.author
    const id = req.params.id

    //check if user is the author or admin
    if(req.user._id == author || req.user.admin) {
        Message.findByIdAndDelete(id)
        .exec((err) => {
            if(err) next(err)

            //on success
            emitter.emit("flushMessages", id)
            res.redirect("/dash")
        })

    } else res.render("messageDelete", { errors: [ { msg: "You are not authorized to delete this message" } ] })
}