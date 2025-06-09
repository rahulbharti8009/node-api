const express = require('express')
const app = express()
const mongoose = require('mongoose');
const { connectMongoDb } = require('./connection/connection');
const userRouter = require('./routes/user');
const staticRouter = require('./routes/staticRouter')
const { logReqRes, hadleTokenMiddleware } = require('./middlewares');
const PORT = 8001;
// 
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

connectMongoDb('mongodb://127.0.0.1:27017/jwt')

app.use(express.json())
app.use(express.urlencoded({extended :  false}))
app.use(logReqRes('log.txt'))
app.use(hadleTokenMiddleware())

// server sode rendering
app.set("view engine", "ejs") 
app.set('views', path.resolve("./views"))
// end server side

app.use('/api', userRouter)
app.use('/', staticRouter)

app.listen(PORT, ()=> {console.log(`Server is ruuning on port ${PORT}`)})





