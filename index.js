require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const indexRoute = require("./routes/index")
const { emitter } = require("./cache")

const bcrypt = require("bcrypt")

emitter.emit("flush")

//mongo db set up
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("db connected"));

//Passport Set up
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
},
(username, password, done) => {
    User.findOne({email: username}, (err, doc) => {
        if(err) return done(err)

        if(doc) {
            //check if password matches
            bcrypt.compare(password, doc.password, (err, match) => {
                if(err) return done(err)

                if(match) return done(null, doc)

                done(null, false, {msg: "Invalid Password or Email"})
            })

        } else {
            done(null, false, { msg: "Invalid Password or Email" })
        }
    })
}
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, doc) => {
        done(err, doc)
    })
})


app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: "1mb"}));
app.use(session({ 
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 120 
    }
}))
app.use(passport.initialize())
app.use(passport.session())

//set up local object
app.use((req, res, next) => { res.locals.currentUser = req.user; next()})

app.use(indexRoute)



server.listen(port, () => console.log("server is live..."))