const env = require('../env')
const LineClientFactory = require('../factory/LineClientFactory')
const line = LineClientFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.help) return false

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
