const env = require('../env')
const logic = require('../logic')
// const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.contact) return false
  console.debug('[-] botEvent.contect.get')
  // let rows = await tool
  //   .db('setting')
  //   .where('option', 'CONTACT_IMAGE')
  //   .orWhere('option', 'CONTACT_MESSAGE')
  //   .orderBy('option')
  // if (rows.length != 2) return false
  // let messages = rows.reduce((total, row) => {
  //   if (row.option === 'CONTACT_IMAGE' && row.value) {
  //     total.push({
  //       type: 'image',
  //       originalContentUrl: row.value,
  //       previewImageUrl: row.value
  //     })
  //   }
  //   if (row.option === 'CONTACT_MESSAGE' && row.value) {
  //     total.push({
  //       type: 'text',
  //       text: row.value
  //     })
  //   }
  //   return total
  // }, [])
  const contact = await logic.setting.getContact()
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
