const line = require('../line')
const s3 = require('../s3')
const TextType = require('../Type/TextType')

var user = null

const listener = async (event) => {
  if (!event.message) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  console.debug('call listener.reply')
  let userExpr = /\s*user:(.*)/gi
  let userMatch = userExpr.exec(event.message.text)
  let messageExpr = /\s*message:(.*)/gi
  let messageMatch = messageExpr.exec(event.message.text)
  // check User and Message
  let hasUser = false
  let hasMessage = false
  if (event.message.text) {
    if (userMatch && userMatch[1].trim().length > 0) {
      hasUser = true
    }
    if (messageMatch && messageMatch[1].trim().length > 0) {
      hasMessage = true
    }
  }
  if (hasUser && hasMessage) {
    user = await line.getProfileByName(userMatch[1].trim())
    if (user) {
      await line.pushMessage(user.friendId, [
        {
          type: 'text',
          text: messageMatch[1].trim(),
        },
      ])
      await line.replyMessage(event.replyToken, [
        {
          type: 'text',
          text: TextType.replyIsSuccessed,
        },
      ])
      user = null
    } else {
      await line.replyMessage(event.replyToken, [
        {
          type: 'text',
          text: TextType.userIsMismatched,
        },
      ])
    }
  } else if (hasUser) {
    user = await line.getProfileByName(userMatch[1].trim())
    await line.replyMessage(event.replyToken, [
      {
        type: 'text',
        text: TextType.replyPrompt,
      },
    ])
  } else if (user) {
    switch (event.message.type) {
      case 'text':
        await line.pushMessage(user.friendId, [
          {
            type: 'text',
            text: event.message.text,
          },
        ])
        await line.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: TextType.replyIsSuccessed,
          },
        ])
        break
      case 'image':
        const buffer = await line.getMessageContent(event.message.id)
        const url = await s3.upload(buffer)
        await line.pushMessage(user.friendId, [
          {
            type: event.message.type,
            originalContentUrl: url,
            previewImageUrl: url,
          },
        ])
        await line.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: TextType.replyIsSuccessed,
          },
        ])
        break
      default:
        await line.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: TextType.messageTypeIsNotInstall,
          },
        ])
    }
    user = null
  }
}

module.exports = listener
