const env = require('../env')
const logic = require('../logic')

const echo = async (replyToken, message, friend) => {
  console.debug('[-] botEvent.echo')
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.echoPrompt[0]
    }
  ])
  let payload = [
    {
      type: 'text',
      text: env.messageEvent.reply + friend.displayName
    },
    {
      type: 'image',
      originalContentUrl: friend.pictureUrl,
      previewImageUrl: friend.pictureUrl
    }
  ]
  switch (message.type) {
    case 'text':
      payload.push({
        type: 'text',
        text: message.text
      })
      break
    case 'image':
      const buffer = await logic.line.getMessageContent(message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      payload.push({
        type: message.type,
        originalContentUrl: url,
        previewImageUrl: url
      })
      break
    default:
      payload.push({
        type: 'text',
        text: env.messageText.echoPrompt[1]
      })
  }
  const masterOfBotGroupId = process.env.LINE_MASTER_OF_BOT_GROUP_ID
  await line.pushMessage(masterOfBotGroupId, payload)
  return true
}

module.exports = echo
