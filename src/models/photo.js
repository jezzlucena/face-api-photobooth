const mongoose = require('mongoose')
const { Schema } = mongoose

const photoSchema = new Schema({
  email: String,
  key: String,
}, {timestamps: true})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo
