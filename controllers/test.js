

//test Get handler
exports.testGet = (req, res, next) => {
    if(req.isAuthenticated()) {


        return res.render("test")
    } 
    
    res.redirect("/login")
}


//Test post Handler
exports.testPost = (req, res, next) => {

}

