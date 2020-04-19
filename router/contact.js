const env = require('../env')
const tool = require('../tool')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.contact) return false
  console.debug('[-] botEvent.contect.get')
  let messages = []
  let rows = await tool.db('setting').where('option', 'CONTACT_IMAGE')
  if (rows[0].value) {
    messages.push({
      type: 'image',
      originalContentUrl: rows[0].value,
      previewImageUrl: rows[0].value,
    })
  }
  rows = await tool.db('setting').where('option', 'CONTACT_MESSAGE')
  if (rows[0].value) {
    messages.push({
      type: 'text',
      text: rows[0].value,
    })
  }
  await tool.line.replyMessage(botEvent.replyToken, messages)
  return true
}

module.exports = {
  get,
}
