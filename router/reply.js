const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')
const LineClientFactory = require('../factory/LineClientFactory')
const line = LineClientFactory()

var user = null

const set = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false

  // check User and Message
  let hasUser = false
  let hasMessage = false
  if (botEvent.message.text) {
    try {
      if (
        botEvent.message.text
          .split('\n')[0]
          .split(':')[0]
          .trim()
          .toLowerCase() === 'user' &&
        botEvent.message.text.split('\n')[0].split(':')[1].trim().length > 0
      ) {
        hasUser = true
      }
    } catch (error) {}
    try {
      if (
        botEvent.message.text
          .split('\n')[2]
          .split(':')[0]
          .trim()
          .toLowerCase() === 'message' &&
        botEvent.message.text.split('\n')[2].split(':')[1].trim().length > 0
      ) {
        hasMessage = true
      }
    } catch (error) {}
  }

  if (hasUser && hasMessage) {
    user = await line.getProfileByName(
      botEvent.message.text.split('\n')[0].split(':')[1].trim(),
    )
    if (user) {
      await line.pushMessage(user.friendId, [
        {
          type: 'text',
          text: botEvent.message.text.split('\n')[2].split(':')[1].trim(),
        },
      ])
      await line.replyMessage(botEvent.replyToken, [
        {
          type: 'text',
          text: env.messageText.replyComplete,
        },
      ])
      user = null
    } else {
      await line.replyMessage(botEvent.replyToken, [
        {
          type: 'text',
          text: env.messageText.usernameIsMismatched,
        },
      ])
    }
  } else if (hasUser) {
    user = await line.getProfileByName(
      botEvent.message.text.split('\n')[0].split(':')[1].trim(),
    )
    await line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.replyPrompt,
      },
    ])
  } else if (user) {
    switch (botEvent.message.type) {
      case 'text':
        await line.pushMessage(user.friendId, [
          {
            type: 'text',
            text: botEvent.message.text,
          },
        ])
        await line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: env.messageText.replyComplete,
          },
        ])
        break
      case 'image':
        const buffer = await line.getMessageContent(botEvent.message.id)
        const url = await logic.s3.uploadBuffer(buffer)
        await line.pushMessage(user.friendId, [
          {
            type: botEvent.message.type,
            originalContentUrl: url,
            previewImageUrl: url,
          },
        ])
        await line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: env.messageText.replyComplete,
          },
        ])
        break
      default:
        await line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: env.messageText.messageTypeIsNoSupport,
          },
        ])
    }
    user = null
  }
}

module.exports = {
  set,
}
