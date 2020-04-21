const env = require('../env')
const tool = require('../tool')
const LineClientFactory = require('../factory/LineClientFactory')
const line = LineClientFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.guide) return false
  let messages = []
  let rows = await tool.db('setting').where('option', 'GUIDE_IMAGE')
  if (rows[0].value) {
    messages.push({
      type: 'image',
      originalContentUrl: rows[0].value,
      previewImageUrl: rows[0].value,
    })
  }
  rows = await tool.db('setting').where('option', 'GUIDE_MESSAGE')
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
