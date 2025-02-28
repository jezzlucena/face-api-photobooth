const Photo = require('../models/photo')

const shortid = require('shortid')

const { S3 } = require('@aws-sdk/client-s3');

const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.VITE_SENDGRID_API_KEY
  }
}))

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY
  }
})

exports.create = (req, res) => {
  var dataUrl = req.body.base64Image
  const buffer = Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64')

  var objData = {
    Bucket: 'face-api-photobooth',
    Key: `${shortid.generate()}.jpg`,
    ContentType: "image/jpeg",
    ContentEncoding: 'base64',
    Body: buffer
  }

  s3.putObject(objData, (err, data) => {
    let photo = new Photo({
      email: req.body.email,
      key: objData.Key
    })

    photo.save().then(sPhoto => {
      transporter.sendMail({
        from: process.env.VITE_SENDGRID_SENDER_IDENTITY_EMAIL,
        to: req.body.email,
        subject: 'Photobooth: Your photo is here!',
        text: `Hello!\n\n

              The photo you took using Photobooth is available at\n
              ${process.env.VITE_APP_AWS_BASE_URL}/${photo.key}\n\n

              Kind regards,
              The Photobooth Team`
      }, function(error, info){
        if (!error) {
          res.json(sPhoto)
        } else {
          console.log(error)
        }
      })
    })
  })
}
