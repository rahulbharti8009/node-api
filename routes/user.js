const express = require('express');
const { getAllUser, getUserById, updateUserById, deleteUserById, createUser } = require('../controller/user.controller');

const router = express.Router()

// router.get("/",(req, res)=> {
//     return res.send("Home page")
// })

router.get("/",getAllUser).post("/",createUser)  

router.route("/:id")
.get(getUserById)
.patch(updateUserById)
.delete(deleteUserById)
// for web
// router.get('/',async(req, res) => {
//     const allUsers = await User.find({})
//     const html =   `
//     <ul>${allUsers.map((user) => `<li>${user.firstName}</li>`).join("")} </ul>`
//     res.send(html)
//     }
// ) 


module.exports = router;
