const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

var replyMode = 0
var friend = null
var friendId = null

const set = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  console.log('[-] botEvent.reply.set', message)
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  if (replyMode === 0) {
    console.debug('replyMode = 0')
    const displayName = message.text.substring(
      env.messageEvent.reply.length + 1,
      message.text.length - 1
    )
    friend = logic.line.getFriendProfileByDisplayName(displayName)
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
