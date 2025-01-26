require('dotenv').config()
const { CustomError } = require('../middleware/errorhandler.middleware')

const authModel = require('../model/auth.model')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

exports.updateUserWithImages = async (
  userId,
  name,
  socialMediaHandle,
  uploadedImages,
) => {
  const user = await authModel.findById(userId)

  if (!user) {
    throw new CustomError('User not found', 404)
  }

  user.name = name || user.name
  user.social_media_handle = socialMediaHandle || user.social_media_handle
  user.images.push(...uploadedImages)

  return await user.save()
}

exports.addUser = async (email, password) => {
  const user = await authModel.findOne({ email: email })

  if (user) {
    throw new CustomError('email already exists', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const adduser = await authModel.create({
    email: email,
    password: hashedPassword,
  })

  return adduser
}

exports.login = async (email, password) => {
  const user = await authModel.findOne({ email: email })

  if (!user) {
    throw new CustomError('user not found', 404)
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw new CustomError('invalid creds', 400)
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1y',
  })

  return { user, token }
}

exports.fetchUsers = async () => {
  const user = await authModel.find()

  return user
}
