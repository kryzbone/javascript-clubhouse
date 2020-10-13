const fs = require("fs");
const User = require("../models/user");


//reading the questions
const filename = "questions.json";
const questions = JSON.parse( fs.readFileSync(filename));

let time = 0;



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

    //check test date
    if(req.user.test > Date.now()) {
        res.render("adminTest", { msg: "Your next test is on " + req.user.test.toDateString() } ) 
    } else {
        //start timmer
        setTimeout( timer , 1000 * 60)

        res.render("adminTest", { questions })
    } 
}



//admin test Post handler
exports.adminTestPost = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login");

    if(req.user.admin) return res.redirect("/dash")

    const answers = req.body
    const results  = new Set()

    //check answers
    questions.forEach((ques) => {
        if(answers[ques.qn] === ques.ans ){
            results.add(true)
        }else results.add(false)
    })

    //check results
    if(results.has(false) || time >= 3 ) {
        const next = 1000 * 60 * 60 * 72
        const testDate = Date.now() + next
        
        User.findOne({}, (err, doc) => {
            if(err) return next(err)

            doc.test = testDate
            doc.save()
            .then(() => res.render("adminTest", { msg: "You Failed please try again in 3 days" }) )
            .catch(next)
        })
 
    } else {
        User.findByIdAndUpdate(req.user._id, { admin: true }, (err, doc) => {
            if(err) return next(err)

            //on success
            res.render("adminTest", { msg: "Congratulations you are now an admin" } )
        })  
    }
}



//======================== Helper Functions ===========================

//Timer function
function timer() {
    if(time < 3) {
        time += 1
        console.log(time)
        setTimeout( timer , 1000 * 60)
    }
}