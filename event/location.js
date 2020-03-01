const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.location) return false
  console.debug('[-] botEvent.location.get')
  const location = await logic.setting.location.get()
  await tool.line.replyMessage(replyToken, [
    {
      type: 'location',
      ...location
    }
  ])
  return true
}

module.exports = {
  get
}
