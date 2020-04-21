const env = require('../env')
const LineClientFactory = require('../factory/LineClientFactory')
const line = LineClientFactory()

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.help) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false

  const text =
    env.messageEvent.register.random +
    '\tสุ่มรหัสสมาชิก\n' +
    env.messageEvent.register.get +
    '\tแสดงรหัสสมาชิก\n'
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'text',
      text: text,
    },
  ])
  return true
}

module.exports = {
  get,
}
