const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

var replyMode = 0
var friend = null
var friendId = null

const set = async (replyToken, message) => {
  if (!message) return false
  console.log('[-] botEvent.reply.set', message)
  if (replyMode === 0) {
    if (message.type !== 'text') return false
    if (!message.text.startsWith(env.messageEvent.reply)) return false
    console.log('replyMode = 0')
    const displayName = message.text.substring(
      env.messageEvent.reply.length,
      message.text.length
    )
    console.debug('displayName', displayName)
    friend = await logic.line.getProfileByName(displayName)
    if (friend == null) {
      await logic.line.replyMessage(replyToken, [
        {
          type: 'text',
          text: 'name of friend is mismatched'
        }
      ])
      replyMode = 0
      return true
    }
    friendId = friend.friendId
    console.debug('friend', JSON.stringify(friend))
    console.debug('friendId', friendId)
    await logic.line.replyMessage(replyToken, [
      {
        type: 'text',
        text: 'wait reply message ...'
      }
    ])
    replyMode = 1
  } else if (replyMode === 1) {
    console.debug('replyMode = 1')
    console.debug('friend', JSON.stringify(friend))
    console.debug('friendId', friendId)

    if (message.type === 'text') {
      await logic.line.pushMessage(friend.friendId, [
        {
          type: 'text',
          text: message.text
        }
      ])
    } else if (message.type === 'image' || message.type === 'video') {
      const buffer = await logic.line.getMessageContent(message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      await logic.line.pushMessage(friend.friendId, [
        {
          type: message.type,
          originalContentUrl: url,
          previewImageUrl: url
        }
      ])
    }

    await logic.line.replyMessage(replyToken, [
      {
        type: 'text',
        text: 'reply message complete'
      }
    ])
    replyMode = 0
  } else {
    return false
  }
  return true
}

module.exports = {
  set
}
