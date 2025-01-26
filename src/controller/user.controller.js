const multer = require('multer')

const { CustomError } = require('../middleware/errorhandler.middleware')

const { uploadToS3 } = require('../utils/awsS3.utils')

const {
  addUser,
  updateUserWithImages,
  fetchUsers,
  login,
} = require('../service/user.service')

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

exports.updateUser = (req, res, next) => {
  upload.array('images', 10)(req, res, async (error) => {
    if (error) {
      return next(error)
    }

    try {
      const userId = req.user?._id
      const { name, socialMediaHandle } = req.body

      if (!userId) {
        throw new CustomError('User ID is required', 400)
      }

      const uploadedImages = []
      const imageFiles = req.files

      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imageData = await uploadToS3(file)
          uploadedImages.push(imageData)
        }
      }

      const updatedUser = await updateUserWithImages(
        userId,
        name,
        socialMediaHandle,
        uploadedImages,
      )

      res.status(200).json({
        message: 'Images uploaded and user updated successfully',
        data: updatedUser,
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}

exports.onboardUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const userService = await addUser(email, password)

    res
      .status(201)
      .json({ message: 'user created successfully', data: userService })
  } catch (error) {
    next(error)
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await login(email, password)

    res.status(200).json({ message: 'Login successful', data: user })
  } catch (error) {
    next(error)
  }
}

exports.fetchAllUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers()

    res.status(200).json({ message: 'users fetched successfully', data: users })
  } catch (error) {
    next(error)
  }
}
