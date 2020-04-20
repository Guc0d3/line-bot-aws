const env = require('../env')
const LineBotFactory = require('../factory/LineBotFactory')
const lineBot = LineBotFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.help) return false

  const text =
    env.messageEvent.register.random +
    '\tสุ่มรหัสสมาชิก\n' +
    env.messageEvent.register.get +
    '\tแสดงรหัสสมาชิก\n'
  await lineBot.client.replyMessage(botEvent.replyToken, [
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