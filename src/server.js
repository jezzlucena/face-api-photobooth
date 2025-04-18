const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

mongoose.connect(process.env.VITE_MONGOOSE_URL)

const photoController = require('./controllers/photo')

const app = express()

app.use(express.static(path.join(__dirname, "..", "/build")))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

var whitelist = ['https://photobooth.jezzlucena.com', 'http://localhost:8084', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.use(express.static('dist'))

app.put('/photo', photoController.create)

app.listen(process.env.VITE_PORT || 8084)
