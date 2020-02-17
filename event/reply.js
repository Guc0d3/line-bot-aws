const env = require('../env')
const tool = require('../tool')

const set = async (replyToken, message) => {
  console.log('[-] botEvent.reply.set', message)
  if (!message) return false
  if (message.type !== 'text') return false
  if (!message.text.startsWith(env.messageEvent.reply)) return false
  // TODO
  console.debug('env.messageEvent.reply.length', env.messageEvent.reply.length)
  console.debug('message.text.length', message.text.length)
  console.debug(
    'friend name:',
    message.text.substring(
      env.messageEvent.reply.length + 1,
      message.text.length - 1
    )
  )
  return true
}

module.exports = {
  set
}
