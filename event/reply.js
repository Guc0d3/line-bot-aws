const env = require('../env')
const logic = require('../logic')

var replyMode = 0
var friend = null

const set = async (replyToken, message) => {
  console.log('[-] botEvent.reply.set', message)
  if (!message) return false
  if (message.type !== 'text') return false
  // TODO
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  if (replyMode === 0) {
    console.debug('replyMode = 0')
    if (!message.text.startsWith(env.messageEvent.reply)) return false
    console.debug(
      'env.messageEvent.reply.length',
      env.messageEvent.reply.length
    )
    console.debug('message.text.length', message.text.length)
    console.debug(
      'displayName:',
      message.text.substring(
        env.messageEvent.reply.length + 1,
        message.text.length - 1
      )
    )
    const displayName = message.text.substring(
      env.messageEvent.reply.length + 1,
      message.text.length - 1
    )
    friend = logic.line.getFriendProfileBydisplayName(displayName)
    console.debug('friend', JSON.stringify(friend))
    await line.replyMessage(replyToken, [
      {
        type: 'text',
        text: 'wait reply message ...'
      }
    ])
    replyMode = 1
  } else if (replyMode === 1) {
    console.debug('replyMode = 1')
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
