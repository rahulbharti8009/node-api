const User = require("../models/url.model")

async function userCreate(req, res) {
    const {name , email,  address, skills, language, hobbies, password} = req.body

    await User.create({
        name : name, email: email, address:address, skills: skills, language:language, hobbies:hobbies, password : password
    })

    return res.status(201).json({status : true ,message :"Success "})
} 


async function getUser(req, res) {
    try{
    const userRecord = await User.find({})
    if (userRecord && userRecord.length > 0) {
        return res.status(200).json({status : true ,message :"Success", value: userRecord})
        }
    return res.status(201).json({status : true ,message :"Success "})
    } catch(err){
        return res.status(400).json({status : true ,message : err.message})

        console.log(err)
    }
} 

module.exports = {userCreate, getUser}