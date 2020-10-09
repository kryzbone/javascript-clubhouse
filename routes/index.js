

const router = require("express").Router()
const Message = require("../models/message");
const { index } = require("../controllers/index")
const { signupGet, signupPost } = require("../controllers/signup");
const { loginGet, loginPost, logout } = require("../controllers/login");
const { testGet, testPost } = require("../controllers/test")




router.get("/", index)

router.get("/signup", signupGet);
router.post("/signup", signupPost);

router.get("/login", loginGet)
router.post("/login", loginPost)
router.get("/logout", logout)

router.get("/test", testGet)
router.post("/test", testPost)





module.exports = router