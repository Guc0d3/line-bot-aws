const env = require('../env')
const logic = require('../logic')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.contact) return false
  console.debug('[-] botEvent.contect.get')
  const contact = await logic.setting.contact.get()
  let messages = []
  if (contact.image) {
    messages.push({
      type: 'image',
      originalContentUrl: contact.image,
      previewImageUrl: contact.image
    })
  }
  if (contact.text) {
    messages.push({
      type: 'text',
      text: contact.text
    })
  }
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, messages)
  return true
}

module.exports = {
  get
}
