const express = require("express")
const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://noatabo:Nytnyt123@cluster0.zewsjam.mongodb.net/?retryWrites=true&w=majority'
const http = require('http');
const socketIo = require('socket.io');
const socketModule = require('./controllers/socketModule')
const bodyParser = require("body-parser")
const crypto = require('crypto-js')
jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { renderForUser } = require('./controllers/servicesController')
const cors = require("cors")
const app = express()
require("dotenv").config()
app.set('view engine', 'ejs')
app.use(cors())
app.use(cookieParser())
app.use('/', require('./routes/router'))
app.use(express.static(__dirname + '/public'));
//app.use(express.urlencoded({ extended: true }))
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = http.createServer(app);
const io = socketIo(server);

socketModule.setupSocketListeners(io);

//mongoose.connect(process.env.CONNECTION_STRING);
//mongoose.connection.on("connected", () => {
//  console.log("connected to DB")
//})
server.listen(8080, () => {
  console.log("listening port 8080")
})
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});
