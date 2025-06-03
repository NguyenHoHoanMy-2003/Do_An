// server.js
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const initRoutes = require('./src/routes')
const connectDatabase = require('./src/config/connectDatabase')

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoutes(app)
connectDatabase()

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})
