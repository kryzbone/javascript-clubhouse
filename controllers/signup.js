const User = require("../models/user")
const bcrypt = require("bcrypt")
const { body, validationResult } = require("express-validator");


exports.signupGet = (req, res) => {
    res.render("signup")
}

// Sign up post handler
exports.signupPost = [
    body("first").notEmpty().withMessage("Enter First Name").isString().isLength({max:255}).trim().escape(),
    body("last").notEmpty().withMessage("Enter Last Name").isString().isLength({max:255}).trim().escape(),
    body("email").notEmpty().withMessage("Provide Email").bail().isEmail().withMessage("Not an Email").trim().escape(),
    body("password").notEmpty().withMessage("Enter Password").isLength({min: 6}).withMessage("password min 6 ").isString().escape(),
    body("comfirm-password").notEmpty().withMessage("Comfirm password").isString().trim().escape()
    .custom((value, { req }) => value === req.body.password).withMessage("Password Not Match"),

    async (req, res, next) => {
        //check for errors
        const error = validationResult(req)

        if(error.isEmpty()) {
            const email = req.body.email;
            const password = req.body.password;
            const salt = parseInt(process.env.SALT);


            try{
                //check if User already exist
                const exist = await User.findOne({ email });
                if(exist) return res.render("signup", { errors: [{msg: "Email Already Exist"}], data: req.body })

                //hash Password
                hashed = await bcrypt.hash(password, salt)

                //Create New User
                const user = User({
                    firstName: req.body.first,
                    lastName: req.body.last,
                    email: req.body. email,
                    password : hashed
                })

                user.save((err) => {
                    if(err) return next(err)

                    res.redirect("/test")
                })

            } catch(err) {
                next(err)
            }
            
        } else {
           res.render("signup", { errors: error.array(), data: req.body }) 
        }
    }
] 