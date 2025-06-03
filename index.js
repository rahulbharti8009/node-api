const express = require('express')
const app = express()
const {User} = require('./models/user.model')
const {connectMongoDb} = require('./connection/connection')
const userRouter = require('./routes/user')
const {logReqRes} = require('./middlewares')
const PORT = 8000;
// connection
connectMongoDb('mongodb://127.0.0.1:27017/rb')
.then(async()=> {
    console.log("mongo db connect")
        // const result = await User.deleteMany({});
}).catch((err) => {
    console.log("Mongo error ", err)
})
// middle ware - to display body data in the post api
app.use(express.urlencoded({extended: false}))
app.use(logReqRes("log.txt"))
app.use("/api/users", userRouter)

app.listen(PORT, ()=> {console.log(`Server is ruuning on port ${PORT}`)})





