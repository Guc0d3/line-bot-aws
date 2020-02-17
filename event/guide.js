const env = require('../env')
const tool = require('../tool')

const get = async (replyToken, message) => {
  console.log('[-] botEvent.guide.get')
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.guide) return false
  let rows = await tool.db('setting')
    .where('option', 'GUIDE_IMAGE')
    .orWhere('option', 'GUIDE_MESSAGE')
    .orderBy('option')
  if (rows.length != 2) return false
  console.debug('rows', rows)
  let messages = rows.reduce((total, row) => {
    if (row.option === 'GUIDE_IMAGE' && row.value) {
      total.push({
        type: 'image',
        originalContentUrl: row.value,
        previewImageUrl: row.value
      })
    }
    if (row.option === 'GUIDE_MESSAGE' && row.value) {
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
