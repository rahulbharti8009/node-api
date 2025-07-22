require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
// firebase
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // 🔐

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
app.use(bodyParser.json());



const { connectMongoDb, connectSocketIO } = require("./connection/connection");
const userRouter = require("./routes/user");
const chatUserRouter = require("./routes/chatuser");

const staticRouter = require("./routes/staticRouter");
const { logReqRes, hadleTokenMiddleware } = require("./middlewares");
const PORT = process.env.PORT ;

// Enable CORS
app.use(
  cors({
    origin: "*", // For production, replace '*' with specific domain like 'http://localhost:3000'
  })
);

const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Connection stablished
connectMongoDb(process.env.MONGO_URL);
// connectMongoDb(
//   "mongodb+srv://root:root@cluster0.4xulazt.mongodb.net/cv?retryWrites=true&w=majority&appName=Cluster0"
// );
// logger
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(logReqRes("log.txt"));
app.use(hadleTokenMiddleware());

// server sode rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// end server side

app.use("/api", userRouter);
app.use("/api", chatUserRouter);
app.get('/', (req, res) => {
   res.json({message : `${process.pid}`});
 });
// app.use("/", staticRouter);
// Socket

const io = new Server(server, {
  cors: {
    origin: "*", // 🔁 Update this to your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  },
});
connectSocketIO(io);

// firebase
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    token,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
