
const {User} = require('../models/user.model')
async function getAllUser(req, res) {
    const allUsers = await User.find({})
    if(allUsers.length === 0) {
        return res.status(200).json({status : 200, message : "No data.", value: []})
    }
    return res.status(200).json({status : 200, message : "Success.", value: allUsers})
}

async function getUserById(req, res) { 
    const id = Number(req.params.id)
        try {
            const user = await User.find({ userid: id });
            // const user = await User.findOne({ userid: id });
            // const user = await User.findById(req.params.id); // it will take 24 character like => sbdhgwdb3uhe3y7838
            console.log("User:", user);
            if(user){
            return  res.status(200).json({ message: 'Success', status : true , value: user})
            }
            else {
                res.status(200).json({ message: 'User not found', status : false })
            }
        } catch (err) {
            console.error("Database error:", err);
        }
}

async function updateUserById(req, res) {
    const id = Number(req.params.id); // assuming `userid` is a number
    const updates = req.body; 
    console.log(updates)
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userid: id },           // find condition
            { $set: {firstName: updates.firstName} },        // fields to update
            { new: true }             // return updated document
        );

        if (updatedUser) {
            return res.status(200).json({ message: "User updated", status: true, user: updatedUser });
        } else {
            return res.status(200).json({ message: "User not found", status: false });
        }
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Server error", status: false });
    }
}

async function deleteUserById(req, res)  {
    const id = Number(req.params.id)
    try{
            const deletedUser = await User.deleteMany({ userid: id });
            // Directly find and delete user by 'userid' field
            // const deletedUser = await User.findOneAndDelete({ userid: id }); find only 1 id at a time
            if (deletedUser.deletedCount > 0) {
                return res.status(200).json({ message: "Deleted", status: true, user: deletedUser });
            } else {
                return res.status(200).json({ message: "User not found", status: false, value: [] });
            }
    }catch(err){
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Server error", status: false });
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function createUser(req, res)  {
    const body = req.body
    console.log(" Body ", body)

    if(!body.firstName || !body.email || !body.lastName || !body.gender || !body.jobTitle){
        return res.status(400).json({ message: 'All field re required', status : false })
    }

    console.log("isValidEmail(body.email) ",isValidEmail(body.email))
    if(!isValidEmail(body.email)){
        return res.status(200).json({ message: 'Please enter valid email id.', status : false })
    }
    const user = await User.findOne({ email: body.email });
    if (user) {
      return res.status(200).json({ status: 200, message: "Email id is already exist in the database.", value: [] });
    }

    const allUsers = await User.find({})

    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gender: body.gender,
        jobTitle: body.jobTitle,
        userid : allUsers.length+1
      });
      
      console.log('response', result);
      return res.status(201).json({ status: true, message: "Success." });
}

module.exports = {
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById,
    createUser
}