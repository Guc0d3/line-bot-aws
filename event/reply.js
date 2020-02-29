const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

var replyMode = 0
var friend = null
var friendId = null

const set = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  // console.log('[-] botEvent.reply.set', message)
  const line = await logic.line.getClient()
  if (replyMode === 0) {
    if (!message.text.startsWith(env.messageEvent.reply)) return false
    console.log('replyMode = 0')
    const displayName = message.text.substring(
      env.messageEvent.reply.length,
      message.text.length
    )
    console.debug('displayName', displayName)
    friend = await logic.line.getProfileByName(displayName)
    friendId = friend.friendId
    console.debug('friend', JSON.stringify(friend))
    console.debug('friendId', friendId)
    await line.replyMessage(replyToken, [
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
    await line.pushMessage(friend.friendId, [
      {
        type: 'text',
        text: message.text
      }
    ])
    await line.replyMessage(replyToken, [
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
