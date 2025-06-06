const User = require("../models/url.model");
const { setUser, getUser } = require("../services/auth");

function isValidEmail(email) {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

async function userCreate(req, res) {
    const {name , email,  address, skills, language, hobbies, password} = req.body
    try {
    if(!isValidEmail(email)) return res.status(200).json({status : true ,message :"Please enter valid email address."})

    const user = await User.findOne({ email: email });
    console.log(user)
    if(user) return res.status(200).json({ status: true, message: "Email already registered" });

    const token = await setUser({"name": name, "email": email, "password": password})
    console.log("token" , token)
    res.cookie("token", token.toString())  

    await User.create({
        name : name, email: email, address:address, skills: skills, language:language, hobbies:hobbies, password : password, token : token
    })

    return res.status(201).json({status : true ,message :"Success "})
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
} 


async function getLogin(req, res) {
    const {email, password} = req.body
    try{
        
        const user = await User.findOne({ email: email , password : password });
        if (user) {
            const isVerify = await getUser(user.token)
            console.log('isVerify' , isVerify)
         return res.status(200).json({status : true ,message :"Success", value: user})
        }
        return res.status(200).json({status : false ,message :"No user exist.", value: []})

    } catch(err){
        return res.status(400).json({status : true ,message : err.message})
    }
} 

module.exports = {userCreate, getLogin}