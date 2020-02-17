const env = require('../env')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.holiday) return false
  // console.log('[-] botEvent.holiday.get')
  let rows = await tool
    .db('setting')
    .where('option', 'HOLIDAY_IMAGE')
    .orWhere('option', 'HOLIDAY_MESSAGE')
    .orderBy('option')
  if (rows.length != 2) return false
  let messages = rows.reduce((total, row) => {
    if (row.option === 'HOLIDAY_IMAGE' && row.value) {
      total.push({
        type: 'image',
        originalContentUrl: row.value,
        previewImageUrl: row.value
      })
    }
    if (row.option === 'HOLIDAY_MESSAGE' && row.value) {
      total.push({
        type: 'text',
        text: row.value
      })
    }
    return total
  }, [])
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  await line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
