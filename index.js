const express = require('express')
const app = express()
const { connectMongoDb } = require('./connection/connection');
const userRouter = require('./routes/user');
const staticRouter = require('./routes/staticRouter')
const { logReqRes, hadleTokenMiddleware } = require('./middlewares');
const PORT =  process.env.PORT || 8001;

const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

connectMongoDb('mongodb+srv://root:root@cluster0.4xulazt.mongodb.net/cv?retryWrites=true&w=majority&appName=Cluster0')

app.use(express.json())
app.use(express.urlencoded({extended :  false}))
app.use(logReqRes('log.txt'))
app.use(hadleTokenMiddleware())

// server sode rendering
app.set("view engine", "ejs") 
app.set('views', path.resolve("./views"))
// end server side

app.use('/api', userRouter)
// app.use('/', staticRouter)

app.listen(PORT, ()=> {console.log(`Server is ruuning on port ${PORT}`)})





