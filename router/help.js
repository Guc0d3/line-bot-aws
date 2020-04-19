const env = require('../env')
const tool = require('../tool')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.help) return false

  const text =
    env.messageEvent.register.random +
    '\tสุ่มรหัสสมาชิก\n' +
    env.messageEvent.register.get +
    '\tแสดงรหัสสมาชิก\n'
  await tool.line.replyMessage(botEvent.replyToken, [
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
