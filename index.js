let express = require('express')
let app = express();
let mongoose = require('mongoose')
let cors = require('cors')
require('dotenv').config();
const http = require('http')
const socketIo= require('socket.io')
const server = http.createServer(app);

// const io = socketIo(server);

const io = socketIo(server, {
  cors: {
    transports: ['polling'],
    origin: "*"
  },
});

module.exports = {
  io: io
};



io.on('connection', (socket) => {
  console.log("New client connected and id is ::",socket.id);
})

io.on("disconnect", (socket) => {
  console.log("disconnect and socket id is::", socket.id)
})


app.use(cors())
app.use(cors({
    origin: '*',
  }));
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

let developerRoutes = require('./routes/routeV1')
app.use('/api/v1',developerRoutes)

server.listen(process.env.PORT,()=>console.log("Backend is running..."))


mongoose.set('strictQuery',false);
mongoose.connect(process.env.DB_URL)

