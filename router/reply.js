const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

var replyMode = 0
var user = null

const set = async botEvent => {
  if (!botEvent.message) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  console.debug('replyMode =', replyMode)
  if (replyMode === 0) {
    if (botEvent.message.type !== 'text') return false
    // get user
    let displayName = null
    try {
      displayName = botEvent.message.text
        .split('\n')[0]
        .split(':')[1]
        .trim()
    } catch (error) {
      console.error('can not get displayName')
    }
    user = await logic.line.getProfileByName(displayName)
    if (user == null) {
      await tool.line.replyMessage(botEvent.replyToken, [
        {
          type: 'text',
          text: env.messageText.usernameIsMismatched
        }
      ])
      return true
    }
    console.debug('user =', JSON.stringify(user))
    // get text
    let text = null
    try {
      text = botEvent.message.text
        .split('\n')[2]
        .split(':')[1]
        .trim()
    } catch (error) {
      console.error('can not get text')
    }
    console.debug('text =', text)
    if (text) {
      await tool.line.pushMessage(user.friendId, [
        {
          type: 'text',
          text
        }
      ])
    } else {
      await tool.line.replyMessage(botEvent.replyToken, [
        {
          type: 'text',
          text: env.messageText.replyPrompt
        }
      ])
      replyMode = 1
    }
    return true
  } else if (replyMode === 1) {
    switch (botEvent.message.type) {
      case 'text':
        await tool.line.pushMessage(user.friendId, [
          {
            type: 'text',
            text: botEvent.message.text
          }
        ])
        await tool.line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: env.messageText.replyComplete
          }
        ])
        break
      case 'image':
        const buffer = await tool.line.getMessageContent(botEvent.message.id)
        const url = await logic.s3.uploadBuffer(buffer)
        await tool.line.pushMessage(user.friendId, [
          {
            type: botEvent.message.type,
            originalContentUrl: url,
            previewImageUrl: url
          }
        ])
        await tool.line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: env.messageText.replyComplete
          }
        ])
        break
      default:
        await tool.line.replyMessage(botEvent.replyToken, [
          {
            type: 'text',
            text: 'Oop, no support message type. please reply again'
          }
        ])
    }
    replyMode = 0
    return true
  }
  return false
}

module.exports = {
  set
}
