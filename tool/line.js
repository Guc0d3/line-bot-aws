const lineBotSdk = require('@line/bot-sdk')

var client = null

const create = channelAccessToken => {
  client = new lineBotSdk.Client({ channelAccessToken })
}

const getMessageContent = async messageId => {
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

const getProfile = async userId => {
  return await client.getProfile(userId)
}

const pushMessage = async (to, messages) => {
  return await client.pushMessage(to, messages)
}

const replyMessage = async (replyToken, messages) => {
  return await client.replyMessage(replyToken, messages)
}

module.exports = {
  create,
  getMessageContent,
  getProfile,
  pushMessage,
  replyMessage
}
