const fs = require("fs");
const User = require("../models/user");


//reading the questions
const filename = "questions.json";
const questions = JSON.parse( fs.readFileSync(filename));


//Test results
const test = {}


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

    //check if test is in progress
    const id = req.user._id;

    if(test[id]) {
        const time = (Date.now() - test[id].start) / 1000
        const left = Math.floor(180 - time)

        if(time < 180) {
            return res.render("adminTest", { questions, min: Math.floor(left/60), sec: Math.floor(left % 60) })
        } else return res.render("adminTest", { questions, min: 0, sec: 0 }) 
    }

    //check test date
    if(req.user.test > Date.now()) {
        res.render("adminTest", { msg: "Your next test is on " + req.user.test.toDateString() } ) 
    } else {
        //start timme
        test[id] = {
            start: Date.now()
        } 
        res.render("adminTest", { questions })
    } 
}



//admin test Post handler
exports.adminTestPost = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login");

    if(req.user.admin) return res.redirect("/dash")

    //check test time
    const id = req.user._id;
    if(test[id]) {
        const timeUp = (Date.now() - test[id].start) / 1000 > 180;

        if(timeUp) {
            reset(id);
            updateUser(id, { test: nextDate() })(next)
            return res.render("adminTest", { msg: "Sorry You Run Out of Time. Please Try Again in 3 Days" })
        }

    } else return res.redirect("/dash")

    
    //check answers
    const results  = new Set();
    const answers = req.body;
    questions.forEach((ques) => {
        if(answers[ques.qn] === ques.ans ){
            results.add(true)
        }else results.add(false)
    })


    //check results
    if(results.has(false)) {
        reset(id)
        updateUser(id, { test: nextDate() })(next)
        return res.render("adminTest", { msg: "Sorry You Failed Please Try Again in 3 Days" })

    } else {
        reset(id)
        updateUser(id, { admin: true })(next)
        res.render("adminTest", { msg: "Congratulations You Are Now an Admin" } )
    }

}



//======================== Helper Functions ===========================


// Reset functions
function reset(id) {
    delete test[id]
}

//update User
function updateUser(id, obj) {
    return (next) => {
        User.findByIdAndUpdate(id, obj, (err) => {
            if(err) return next(err)
        })  
    }
}

//generate next test date
function nextDate() {
    const next = 1000 * 60 * 60 * 72
    return Date.now() + next
}