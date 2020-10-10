const router = require("express").Router()
const { index } = require("../controllers/index")
const { signupGet, signupPost } = require("../controllers/signup");
const { loginGet, loginPost, logout } = require("../controllers/login");
const { testGet, testPost } = require("../controllers/test");
const { postGet, postPost } = require("../controllers/post");
const { dash } = require("../controllers/dash");
const { messageEdit, messageEditPost, messageDelete, messageDeletePost } = require("../controllers/message");




router.get("/", index)

router.get("/signup", signupGet);
router.post("/signup", signupPost);

router.get("/login", loginGet)
router.post("/login", loginPost)
router.get("/logout", logout)

router.get("/test", testGet)
router.post("/test", testPost)

router.get("/post", postGet)
router.post("/post", postPost)

router.get("/dash", dash)

router.get("/messages/edit/:id", messageEdit)
router.post("/messages/edit/:id", messageEditPost)
router.get("/messages/delete/:id", messageDelete)
router.post("/messages/delete/:id", messageDeletePost)




module.exports = router