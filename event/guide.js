const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.guide) return false
  console.debug('[-] botEvent.guide.get')
  let rows = await tool
    .db('setting')
    .where('option', 'GUIDE_IMAGE')
    .orWhere('option', 'GUIDE_MESSAGE')
    .orderBy('option')
  if (rows.length != 2) return false
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
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
