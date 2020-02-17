const lineBotSdk = require('@line/bot-sdk')

const getClient = async channelAccessToken => {
  // console.log('[-] tool.line.getClient')
  return new lineBotSdk.Client({
    channelAccessToken
  })
}

const getMessageContent = async (line, messageId) => {
  // console.log('[-] tool.line.getMessageContent')
  return new Promise((resolve, reject) => {
    line.getMessageContent(messageId).then(stream => {
      var content = []
      stream
        .on('data', chunk => {
          content.push(new Buffer.from(chunk))
        })
        .on('error', err => {
          reject(err)
        })
        .on('end', function() {
          resolve(Buffer.concat(content))
        })
    })
  })
}

module.exports = {
  getClient,
  getMessageContent
}
