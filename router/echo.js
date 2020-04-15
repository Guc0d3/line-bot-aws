const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const echo = async (replyToken, message, user) => {
  // reply to user
  switch (message.type) {
    case 'text':
    case 'image':
      await tool.line.replyMessage(replyToken, [
        {
          type: 'text',
          text: env.messageText.echoPrompt[0]
        }
      ])
      break
    default:
      await tool.line.replyMessage(replyToken, [
        {
          type: 'text',
          text: env.messageText.echoPrompt[1]
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
  // let messages = [
  //   {
  //     type: 'text',
  //     text: 'User: ' + user.displayName + '\nAvatar: ' + user.pictureUrl
  //   }
  // ]
  switch (message.type) {
    case 'text':
      // messages.push({
      //   type: 'text',
      //   text: message.text
      // })
      text += message.text
      break
    case 'image':
      const buffer = await tool.line.getMessageContent(message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      // messages.push({
      //   type: message.type,
      //   originalContentUrl: url,
      //   previewImageUrl: url
      // })
      text += url
      break
    default:
      // messages.push({
      //   type: 'text',
      //   text: env.messageText.echoPrompt[2]
      // })
      text += env.messageText.echoPrompt[2]
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
