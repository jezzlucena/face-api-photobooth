const AWS = require('aws-sdk')
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const shortid = require('shortid')
const path = require('path')
const cors = require('cors')

dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const app = express()

const s3 = new AWS.S3()

app.use(express.static(path.join(__dirname, "..", "/build")))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

var whitelist = ['https://face-api-photobooth.herokuapp.com:8080', 'https://face-api-photobooth.herokuapp.com:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "..", "build/index.html"))
})

app.post('/upload', function(req, res){
  var dataUrl = req.body.base64Image
  const buffer = new Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64')

  var objData = {
    Bucket: 'face-api-photobooth',
    Key: `${shortid.generate()}.jpg`,
    ContentType: "image/jpeg",
    ContentEncoding: 'base64',
    Body: buffer
  }

  s3.putObject(objData, function (err, data) {
    res.json({ imageUrl: `https://face-api-photobooth.s3-us-west-1.amazonaws.com/${objData.Key}`})
  })
})

app.listen(process.env.PORT || 8080)
