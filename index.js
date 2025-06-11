const express = require("express");
const app = express();
const cors = require('cors');

const { connectMongoDb } = require("./connection/connection");
const userRouter = require("./routes/user");
const staticRouter = require("./routes/staticRouter");
const dns = require('node:dns');
const os = require('node:os');

const { logReqRes, hadleTokenMiddleware } = require("./middlewares");
const PORT = process.env.PORT || 8001;
const options = { family: 4 };

dns.lookup(os.hostname(), options, (err, addr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`IPv4 address: ${addr}`);
  }
});

// Enable CORS
app.use(cors({
  origin: '*', // For production, replace '*' with specific domain like 'http://localhost:3000'
}));


const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

connectMongoDb("mongodb://127.0.0.1:27017/cv");
// connectMongoDb(
//   "mongodb+srv://root:root@cluster0.4xulazt.mongodb.net/cv?retryWrites=true&w=majority&appName=Cluster0"
// );
//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));
app.use(hadleTokenMiddleware());

// server sode rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// end server side

app.use("/api", userRouter);
app.use("/", staticRouter);

app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
