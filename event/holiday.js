const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.holiday) return false
  console.debug('[-] botEvent.holiday.get')
  const holiday = await logic.setting.holiday.get()
  let messages = []
  if (holiday.image) {
    messages.push({
      type: 'image',
      originalContentUrl: holiday.image,
      previewImageUrl: holiday.image
    })
  }
  if (holiday.text) {
    messages.push({
      type: 'text',
      text: holiday.text
    })
  }
  await tool.line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
