const mongoose = require('mongoose')

const authSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    social_media_handle: { type: String, trim: true },
    images: [
      {
        url: {
          type: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true },
)

const authModel = mongoose.model('auth', authSchema)

module.exports = authModel
