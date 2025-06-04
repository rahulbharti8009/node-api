const express = require('express')
const app = express()
const {connectMongoDb} = require('./connection/connection')
const urlRouter = require('./routes/url')
const staticRouter = require('./routes/staticRouter')

const {logReqRes} = require('./middlewares')
const { URL } = require('./models/url.model')
const path = require('path')
const PORT = 8001;
// connection
connectMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(async()=> {
    console.log("mongo db connect")
        // const result = await User.deleteMany({});
}).catch((err) => {
    console.log("Mongo error ", err)
})
// server sode rendering
app.set("view engine", "ejs") 
app.set('views', path.resolve("./views"))
// end server side
// middle ware - to display body data in the post api
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(logReqRes("log.txt"))

app.use("/api", urlRouter)
app.use("/page", staticRouter) 

app.get("/:shortId", async(req, res)=> {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
          { shortId },
          {
            $push: {
                visitHistory: {
                    timestamps: Date.now(), 
              },
            },
          }
        );
    
        if (!entry) {
          return res.status(404).send("Short URL not found") ;
        }
    
        res.redirect(entry.redirectURL);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    }
)

app.listen(PORT, ()=> {console.log(`Server is ruuning on port ${PORT}`)})





