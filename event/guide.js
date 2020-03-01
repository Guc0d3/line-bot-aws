const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.guide) return false
  console.debug('[-] botEvent.guide.get')
  const guide = await logic.setting.guide.get()
  let messages = []
  if (guide.image) {
    messages.push({
      type: 'image',
      originalContentUrl: guide.image,
      previewImageUrl: guide.image
    })
  }
  if (guide.text) {
    messages.push({
      type: 'text',
      text: guide.text
    })
  }
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
