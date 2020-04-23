const S3Factory = require('./Factory/S3')

const upload = async (buffer) => {
  const url = await S3Factory().upload(
    process.env.BUCKET_NAME,
    process.env.ACCESS_KEY_ID,
    process.env.SECRET_ACCESS_KEY,
    buffer,
  )
  return url
}

module.exports = {
  upload,
}
