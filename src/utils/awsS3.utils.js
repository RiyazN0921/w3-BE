const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const { CustomError } = require('../middleware/errorhandler.middleware')

require('dotenv').config()

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETEACCESSKEY,
  },
})

exports.uploadToS3 = async (file) => {
  try {
    const uploadParams = {
      Bucket: process.env.BUCKET,
      Key: `UserImages/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    await s3Client.send(new PutObjectCommand(uploadParams))

    const publicUrl = `https://${uploadParams.Bucket}.s3.${process.env.REGION}.amazonaws.com/${uploadParams.Key}`

    return {
      url: publicUrl,
      mimetype: file.mimetype,
    }
  } catch (error) {
    throw new CustomError('Failed to upload image to AWS S3', 500)
  }
}
