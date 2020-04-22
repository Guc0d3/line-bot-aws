const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/CommandType')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.holiday) return false
  let messages = []
  let rows = await database('setting').where('option', 'HOLIDAY_IMAGE')
  if (rows[0].value) {
    messages.push({
      type: 'image',
      originalContentUrl: rows[0].value,
      previewImageUrl: rows[0].value,
    })
  }
  rows = await database('setting').where('option', 'HOLIDAY_MESSAGE')
  if (rows[0].value) {
    messages.push({
      type: 'text',
      text: rows[0].value,
    })
  }
  await line.replyMessage(botEvent.replyToken, messages)
  return true
}

module.exports = {
  get,
}
