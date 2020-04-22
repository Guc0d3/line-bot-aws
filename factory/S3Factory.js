const AWS = require('aws-sdk')
const FileType = require('file-type')
const moment = require('moment')

const S3Factory = () => {
  const self = {}
  const behaviors = (self) => ({
    upload: async (
      bucket,
      accessKeyId,
      secretAccessKey,
      buffer,
      acl = 'public-read',
      locale = 'th',
    ) => {
      const fileMime = await FileType.fromBuffer(buffer)
      if (fileMime == null) return null
      moment.locale(locale)
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const filePath = 'files/' + moment(now).format('YYYY-MM-DD') + '/'
      const fileName = moment(now).unix() + '.' + fileMime.ext
      const params = {
        ACL: acl,
        Body: buffer,
        Bucket: bucket,
        Key: filePath + fileName,
      }
      try {
        let s3 = new AWS.S3({
          accessKeyId,
          secretAccessKey,
        })
        let res = await s3.upload(params).promise()
        return res.Location
      } catch (error) {
        console.error(error)
        return null
      }
    },
  })
  return Object.assign(self, behaviors())
}

module.exports = S3Factory
