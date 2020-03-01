const env = require('../env')
const logic = require('../logic')

const echo = async (replyToken, message, friend) => {
  console.debug('[-] botEvent.echo')
  await logic.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.echoPrompt[0]
    }
  ])
  let messages = [
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
      messages.push({
        type: 'text',
        text: message.text
      })
      break
    case 'image':
      const buffer = await logic.line.getMessageContent(message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      messages.push({
        type: message.type,
        originalContentUrl: url,
        previewImageUrl: url
      })
      break
    default:
      messages.push({
        type: 'text',
        text: env.messageText.echoPrompt[1]
      })
  }
  await logic.line.pushMessage(
    process.env.LINE_MASTER_OF_BOT_GROUP_ID,
    messages
  )
  return true
}

module.exports = echo
