let express = require('express')
let app = express();
let mongoose = require('mongoose')
let cors = require('cors')
require('dotenv').config();



app.use(cors())
app.use(cors({
    origin: '*',
  }));
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

let developerRoutes = require('./routes/routeV1')
app.use('/api/v1',developerRoutes)

app.listen(process.env.PORT,()=>console.log("Backend is running..."))


mongoose.set('strictQuery',false);
mongoose.connect(process.env.DB_URL)

