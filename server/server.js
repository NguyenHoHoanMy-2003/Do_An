// server.js
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const initRoutes = require('./src/routes')
const connectDatabase = require('./src/config/connectDatabase')
const path = require('path');
const session = require('express-session');
const passport = require('passport');

require('./src/auth/google');
require('./src/auth/facebook');

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.use(session({
  secret: "your-secret",
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

initRoutes(app)
connectDatabase()

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})
