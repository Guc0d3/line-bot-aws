const env = require('../env')
const logic = require('../logic')
const LineClientFactory = require('../factory/LineClientFactory')

const line = LineClientFactory()

const set = async (botEvent) => {
  // no echo message in master of bot group
  if (botEvent.source.groupId === process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  // echo support 'text' and 'image' only
  if (['text', 'image'].indexOf(botEvent.message.type) === -1) return false

  // get user
  const user = await line.getProfileById(botEvent.source.userId)

  // echo to master of bot
  let text =
    'User: ' +
    user.displayName +
    '\nDisplay: ' +
    user.pictureUrl +
    '\nMessage: '
  switch (botEvent.message.type) {
    case 'text':
      text += botEvent.message.text
      break
    case 'image':
      const buffer = await line.getMessageContent(botEvent.message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      text += url
      break
    default:
      text += env.messageText.undefined
  }
  await line.pushMessage(process.env.LINE_MASTER_OF_BOT_GROUP_ID, [
    {
      type: 'text',
      text,
    },
  ])

  return true
}

module.exports = {
  set,
}
