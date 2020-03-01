const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const noEvent = async (replyToken, message, friend) => {
  console.debug('[-] botEvent.noEvent')
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.noEventPrompt[0]
    }
  ])
  let payload = null
  if (message.type === 'text') {
    payload = [
      {
        type: 'text',
        text: message.text
      }
    ]
  } else if (message.type === 'image' || message.type === 'video') {
    const buffer = await tool.line.getMessageContent(line, message.id)
    const url = await logic.s3.uploadBuffer(buffer)
    payload = [
      {
        type: message.type,
        originalContentUrl: url,
        previewImageUrl: url
      }
    ]
  } else {
    payload = [
      {
        type: 'text',
        text: env.messageText.noEventPrompt[1]
      }
    ]
  }
  const masterOfBotGroupId = process.env.LINE_MASTER_OF_BOT_GROUP_ID
  await line.pushMessage(masterOfBotGroupId, [
    {
      type: 'text',
      text: env.messageEvent.reply + friend.displayName
    },
    {
      type: 'image',
      originalContentUrl: friend.pictureUrl,
      previewImageUrl: friend.pictureUrl
    },
    ...payload
  ])
  return true
}

module.exports = noEvent
