const fs = require("fs");
const User = require("../models/user")


const file = "questions.json"
const ques =  JSON.parse( fs.readFileSync(file))
shuffle()

let temp = {}


//test Get handler
exports.testGet = (req, res, next) => {
    if(req.isAuthenticated()) {
        const ran = Math.floor(Math.random() * ques.length)
        temp.q = ques[ran]
        return res.render("test", { title: "Are you wealthy to join the club?", question: ques[ran] })
    } 
    
    res.redirect("/login")
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
            temp.q = ques[ran]
            res.render("test", { title: "Are you sure you are wealthy. Try Again", question: ques[ran] } )
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
