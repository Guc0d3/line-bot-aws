const env = require('../env')
const tool = require('../tool')

const noEvent = async (replyToken, message, friend) => {
  console.log('[-] botEvent.noEvent')
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  await line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.noEventPrompt[0]
    }
  ])
  let rows = await tool.db('setting').where({ option: 'CONTACT_ID' })
  let contactId = rows[0].value
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
    const url = await tool.s3.uploadBuffer(
      process.env.BUCKET_NAME,
      process.env.ACCESS_KEY_ID,
      process.env.SECRET_ACCESS_KEY,
      buffer
    )
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
  await line.pushMessage(contactId, [
    {
      type: 'text',
      text: '=> ' + friend.displayName
    },
    ...payload
  ])
  return true
}

module.exports = noEvent
