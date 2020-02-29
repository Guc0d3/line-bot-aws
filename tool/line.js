const lineBotSdk = require('@line/bot-sdk')

const getClient = channelAccessToken => {
  return new lineBotSdk.Client({ channelAccessToken })
}

const getMessageContent = async (client, messageId) => {
  return new Promise((resolve, reject) => {
    client.getMessageContent(messageId).then(stream => {
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
