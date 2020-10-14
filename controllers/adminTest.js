const fs = require("fs");
const User = require("../models/user");


//reading the questions
const filename = "questions.json";
const questions = JSON.parse( fs.readFileSync(filename));
const results  = new Set();

let min = 2;
let sec = 60;
let inProgress = false;
let timeUp = false;
let clear;



//get test handler
exports.adminTest = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    if(req.user.admin) return res.redirect("/dash")

    //check test date
    if(req.user.test > Date.now()) {
        res.render("adminTest", { msg: "Your next test is on " + req.user.test.toDateString() } ) 
    } else  res.render("adminTest") 
}



//Start test handler
exports.adminTestStart = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login");

    if(req.user.admin) return res.redirect("/dash")

    //test in progress
    if(inProgress) return res.render("adminTest", { questions, min, sec })

    //check test date
    if(req.user.test > Date.now()) {
        res.render("adminTest", { msg: "Your next test is on " + req.user.test.toDateString() } ) 
    } else {
        //start timmer
        inProgress = true
        timer()

        res.render("adminTest", { questions })
    } 
}



//admin test Post handler
exports.adminTestPost = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login");

    if(req.user.admin) return res.redirect("/dash")

    const answers = req.body
    

    //check answers
    questions.forEach((ques) => {
        if(answers[ques.qn] === ques.ans ){
            results.add(true)
        }else results.add(false)
    })

    //check results
    if(results.has(false) || timeUp ) {
        const next = 1000 * 60 * 60 * 72
        const testDate = Date.now() + next

        User.findByIdAndUpdate(req.user._id, { test: testDate }, (err) => {
            if(err) return next(err)

            //on success
            reset()
            res.render("adminTest", { msg: "You Failed please try again in 3 days" })
        })  
 
    } else {
        User.findByIdAndUpdate(req.user._id, { admin: true }, (err) => {
            if(err) return next(err)

            //on success
            reset()
            res.render("adminTest", { msg: "Congratulations you are now an admin" } )
        })  
    }
}



//======================== Helper Functions ===========================

//Timer function
function timer() {
    console.log(min, sec)
    if(sec <= 00) {
        sec = 60
        min -= 1
    }

    if(min < 0) {
       timeUp = true
       inProgress = false
    }else {
        sec -= 1
        clear = setTimeout( timer , 1000)
    }  
   
}

// Reset functions
function reset() {
    timeUp = false
    inProgress = false
    min = 2; sec = 60;
    results.clear()
    clearTimeout(clear)
}