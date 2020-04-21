const env = require('../env')
const tool = require('../tool')
const LineClientFactory = require('../factory/LineClientFactory')
const line = LineClientFactory()

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.holiday) return false
  let messages = []
  let rows = await tool.db('setting').where('option', 'HOLIDAY_IMAGE')
  if (rows[0].value) {
    messages.push({
      type: 'image',
      originalContentUrl: rows[0].value,
      previewImageUrl: rows[0].value,
    })
  }
  rows = await tool.db('setting').where('option', 'HOLIDAY_MESSAGE')
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
