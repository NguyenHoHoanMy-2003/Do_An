// server.js
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const initRoutes = require('./src/routes')
const connectDatabase = require('./src/config/connectDatabase')
const path = require('path');


const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

initRoutes(app)
connectDatabase()

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})
