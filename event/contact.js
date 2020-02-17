const env = require('../env')
const tool = require('../tool')

const get = async (replyToken, message) => {
  console.log('[-] botEvent.contact.get')
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.contact) return false
  let rows = await tool.db('setting')
    .where('option', 'CONTACT_IMAGE')
    .orWhere('option', 'CONTACT_MESSAGE')
    .orderBy('option')
  if (rows.length != 2) return false
  console.debug('rows', rows)
  let messages = rows.reduce((total, row) => {
    if (row.option === 'CONTACT_IMAGE' && row.value) {
      total.push({
        type: 'image',
        originalContentUrl: row.value,
        previewImageUrl: row.value
      })
    }
    if (row.option === 'CONTACT_MESSAGE' && row.value) {
      total.push({
        type: 'text',
        text: row.value
      })
    }
    return total
  }, [])
  console.debug('messages', messages)
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  await line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
