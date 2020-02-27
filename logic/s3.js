const tool = require('../tool')

const uploadBuffer = async buffer => {
  // console.log('[-] logic.s3.uploadBuffer')
  const url = await tool.s3.uploadBuffer(
    process.env.BUCKET_NAME,
    process.env.ACCESS_KEY_ID,
    process.env.SECRET_ACCESS_KEY,
    buffer
  )
  return url
}

module.exports = {
  uploadBuffer
}
