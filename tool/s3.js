const awsSdk = require('aws-sdk')
const fileType = require('file-type')
const moment = require('moment')

moment.locale('th')

const uploadBuffer = async (
  bucket,
  accessKeyId,
  secretAccessKey,
  buffer,
  acl = 'public-read'
) => {
  console.log('[-] tool.s3.uploadBuffer')
  let fileMime = await fileType.fromBuffer(buffer)
  if (fileMime == null) {
    console.error('the string supplied is not a file type')
    return null
  }
  let now = moment().format('YYYY-MM-DD HH:mm:ss')
  let filePath = 'files/' + moment(now).format('YYYY-MM-DD') + '/'
  let fileName = moment(now).unix() + '.' + fileMime.ext
  let params = {
    ACL: acl,
    Body: buffer,
    Bucket: bucket,
    Key: filePath + fileName
  }
  try {
    let s3 = new awsSdk.S3({
      accessKeyId,
      secretAccessKey
    })
    let res = await s3.upload(params).promise()
    return res.Location
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports = {
  uploadBuffer
}
