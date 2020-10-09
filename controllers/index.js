const Message = require("../models/message")



exports.index = (req, res) => {
    res.render("index", {title: "Welcome to  JavaScript Club House"} )
}