const line = require('../line')
const s3 = require('../s3')
const TextType = require('../Type/TextType')

var user = null

const listener = async (event) => {
  if (!event.message) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  // check User and Message
  let hasUser = false
  let hasMessage = false
  if (event.message.text) {
    try {
      if (
        event.message.text.split('\n')[0].split(':')[0].trim().toLowerCase() ===
          'user' &&
        event.message.text.split('\n')[0].split(':')[1].trim().length > 0
      ) {
        hasUser = true
      }
    } catch (error) {}
    try {
      if (
        event.message.text.split('\n')[2].split(':')[0].trim().toLowerCase() ===
          'message' &&
        event.message.text.split('\n')[2].split(':')[1].trim().length > 0
      ) {
        hasMessage = true
      }
    } catch (error) {}
  }
  if (hasUser && hasMessage) {
    user = await line.getProfileByName(
      event.message.text.split('\n')[0].split(':')[1].trim(),
    )
    if (user) {
      await line.pushMessage(user.friendId, [
        {
          type: 'text',
          text: event.message.text.split('\n')[2].split(':')[1].trim(),
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
    user = await line.getProfileByName(
      event.message.text.split('\n')[0].split(':')[1].trim(),
    )
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
