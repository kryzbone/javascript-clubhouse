const fs = require("fs");
const User = require("../models/user")


const file = "questions.json"
const ques =  JSON.parse( fs.readFileSync(file))
shuffle()

let temp = {}
const tracker = new Set();

//test Get handler
exports.testGet = (req, res, next) => {
    if(req.isAuthenticated()) {
        let ran = Math.floor(Math.random() * ques.length)
        
        //prevent repetition of question
        track(ran, (r) => {
            temp.q = ques[r]
            return res.render("test", { title: "Are you wealthy to join the club?", question: ques[r] })
        })
 
    } else res.redirect("/login")
}


//Test post Handler
exports.testPost = async (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect("/login")

    if(temp.q) {

        if(req.body.ans === temp.q.ans) {
            try{
                doc = await User.findById(req.user._id)
                doc.status = "active";
                await doc.save()
                temp = {}
                res.redirect("/dash")
            } catch (err) {
                next(err)
            }
            
        } else {
            const ran = Math.floor(Math.random() * ques.length)

            //prevent repetition of question
            track(ran, (r) => {
                temp.q = ques[r]
                return res.render("test", { title: "Are you sure you are wealthy. Try Again", question: ques[r] } )
            })  
        }   
        
    } else res.render("test", { title: "Are you wealthy to join the club?", errors: [{msg: "Something went wrong please try again"}] })
    
}



//shuffle questions
function shuffle() {
    for(let i = ques.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = ques[i]
        ques[i] = ques[j]
        ques[j] = temp
    }
}

//tracker function
function track(ran, cb) {
    if(tracker.has(ran)) {

        if(tracker.size >= 10) tracker.clear()
            
        const newRan = Math.floor(Math.random() * ques.length);
        track(newRan, cb)
             
    } else {
        tracker.add(ran)
        cb(ran)
    }
}