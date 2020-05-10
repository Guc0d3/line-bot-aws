const line = require('../line')
const CommandType = require('../Type/Command')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.help) return false
  console.debug('call listener.help')
  const text =
    CommandType.register.randomCode +
    '\tสุ่มรหัสสมาชิก\n' +
    CommandType.register.getCode +
    '\tแสดงรหัสสมาชิก\n' +
    CommandType.on +
    '\tเปิดบอท\n' +
    CommandType.off +
    '\tปิดบอท\n'
  await line.replyMessage(event.replyToken, [
    {
      type: 'text',
      text: text,
    },
  ])
  return true
}

module.exports = listener
