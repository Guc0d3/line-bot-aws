const line = require('../line')
const s3 = require('../s3')
const TextType = require('../Type/TextType')

const listener = async (botEvent) => {
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
      const url = await s3.upload(buffer)
      text += url
      break
    default:
      text += TextType.undefined
  }
  await line.pushMessage(process.env.LINE_MASTER_OF_BOT_GROUP_ID, [
    {
      type: 'text',
      text,
    },
  ])

  return true
}

module.exports = listener
