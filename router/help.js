const line = require('../line')
const CommandType = require('../Type/CommandType')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.help) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false

  const text =
    CommandType.register.random +
    '\tสุ่มรหัสสมาชิก\n' +
    CommandType.register.get +
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
