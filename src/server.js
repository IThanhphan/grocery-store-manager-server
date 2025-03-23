const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const database = require('./config/database/db')
const route = require('./routes/indexRoute')

dotenv.config()
const app = express()

database.connect()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

route(app)

app.listen(process.env.PORT, () => {
  console.log('Server is running')
})