const passport = require("passport");
const { body, validationResult } = require("express-validator")



//login form handler
exports.loginGet = (req, res, next) => {
    if(req.isAuthenticated()) return res.redirect("/dash")
    res.render("login")
}


//login post handler
exports.loginPost = [ 
    body("email").notEmpty().withMessage("Enetr Enail").bail().isEmail().withMessage("Not Email").trim().escape(),
    body("password").notEmpty().withMessage("Enter Password").isString().trim().escape(),

    (req, res, next) => {
        //check for errors 
        const error = validationResult(req)

        if(error.isEmpty()) {

            passport.authenticate("local", (err, user, info) => {
                if(err) return next(err);
    
                if(user) {
                    req.logIn(user, (err) => {
                        if(err) return next(err)
    
                        //on succes
                        if(user.status === "active") {
                            res.redirect("/dash")
                        }else res.redirect("/test")

                    })
                } else {
                    res.render("login", {errors: [ info ] })
                }
    
            })(req, res, next)

        } else {
            res.render("login", { errors: error.array() })
        }
 
    }
]


//logout handler
exports.logout = (req, res, next) => {
    req.logout()
    res.redirect("/login")
}