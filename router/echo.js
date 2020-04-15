const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const echo = async (replyToken, message, user) => {
  // reply to user
  switch (message.type) {
    case 'text':
    case 'image':
      break
    default:
      await tool.line.replyMessage(replyToken, [
        {
          type: 'text',
          text: env.messageText.echoPrompt[0]
        }
      ])
  }
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
      text += env.messageText.echoPrompt[1]
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
