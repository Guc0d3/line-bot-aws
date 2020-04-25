const line = require('../line')
const CommandType = require('../Type/CommandType')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.help) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  const text =
    CommandType.register.randomCode +
    '\tสุ่มรหัสสมาชิก\n' +
    CommandType.register.getCode +
    '\tแสดงรหัสสมาชิก\n'
  await line.replyMessage(event.replyToken, [
    {
      type: 'text',
      text: text,
    },
  ])
  return true
}

module.exports = listener
