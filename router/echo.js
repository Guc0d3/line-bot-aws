const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const echo = async (replyToken, message, user) => {
  // echo to master of bot
  let text =
    'User: ' +
    user.displayName +
    '\nDisplay: ' +
    user.pictureUrl +
    '\nMessage: '
  switch (message.type) {
    case 'text':
      text += message.text
      break
    case 'image':
      const buffer = await tool.line.getMessageContent(message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      text += url
      break
    default:
      text += env.messageText.undefined
  }
  await tool.line.pushMessage(process.env.LINE_MASTER_OF_BOT_GROUP_ID, [
    {
      type: 'text',
      text
    }
  ])
  return true
}

module.exports = echo
