const express = require('express')
const users = require('./MOCK_DATA.json')
const app = express()
const fs = require('fs')
const mongoose = require("mongoose")

const PORT = 8000;

// connection
mongoose.connect('mongodb://127.0.0.1:27017/demo')
.then(()=> {
    console.log("mongo db connect")
}).catch((err) => {
    console.log("Mongo error ", err)
})

// middle ware - to display body data in the post api
app.use(express.urlencoded({extended: false}))
app.use((req, res, next)=> {
    console.log("I am a middleware")
    fs.appendFile('log.txt', `${new Date().getTime()} ${req.ip}: ${req.method} ${req.path}\n`, (err, data)=> {
        if (err) {
            console.error('middleware Error writing file:', err);
            return res.status(500).json({ error: 'Failed to save request log' });
        }
        next()
    })
})

app.get("/",(req, res)=> {
    return res.send("Home page")
})

app.get("/api/users",(req, res)=> {
    return res.json(users)
})

app.route("/api/users/:id")
.get((req, res)=> {
    const id = Number(req.params.id)
    const user = users.filter((user) => user.id === id)
    if(user.length == 0 ) res.status(404).json({ message: 'User not found', status : false })
    return res.json(user)
})
.patch((req, res)=> {
    return res.json(users)
})
.delete((req, res)=> {
    const id = Number(req.params.id)
    console.log('Deleting user with id:', id);
 // Filter out the user with the matching id
 const filteredUsers = users.filter(user => user.id !== id);

 // Write the new user list back to the JSON file
 fs.writeFile('./MOCK_DATA.json', JSON.stringify(filteredUsers, null, 2), (err) => {
     if (err) {
         console.error('Error writing file:', err);
         return res.status(500).json({ error: 'Failed to delete user' });
     }
     console.log('User deleted successfully');
     return res.json({ message: 'User deleted successfully', users: filteredUsers });
 }); 
})

app.post("/api/users",(req, res)=> {
    const body = req.body
    console.log("Body", body)
    if(!body.first_name || !body.email || !body.last_name || !body.gender){
        return res.status(400).json({ message: 'All field re required', status : false })
    }
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=> {
        if (err) {
            console.error('err', err);
            return res.status(500).json({ message: 'Failed to save user', status : false });
        }
        console.log('User deleted successfully');
        return res.status(201).json({ message: 'User save successfully', status : true });    })
})  
// for web
app.get('/users',(req, res) => {
    const html =    `
    <ul>${users.map((user) => `<li>${user.first_name}</li>`).join("")} </ul>`
    res.send(html)
    }
) 


app.listen(PORT, ()=> {console.log(`Server is ruuning on port ${PORT}`)})





