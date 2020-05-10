const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/Command')
const TextType = require('../Type/Text')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.off) return false
  console.debug('call listener.off')
  await database('setting').where('option', 'BOT_STATUS').update({ value: '0' })
  await line.replyMessage(event.replyToken, {
    type: 'text',
    text: TextType.botIsOff,
  })
  return true
}

module.exports = listener
