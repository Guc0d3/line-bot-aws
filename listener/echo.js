const line = require('../line')
const s3 = require('../s3')
const TextType = require('../Type/Text')

const listener = async (event) => {
  // no echo message in master of bot group
  if (event.source.groupId === process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  // echo support 'text' and 'image' only
  if (['text', 'image', 'location'].indexOf(event.message.type) === -1)
    return false
  console.debug('call listener.echo')
  // get user
  const user = await line.getProfileById(event.source.userId)
  // echo to master of bot
  let text =
    'User: ' +
    user.displayName +
    '\nDisplay: ' +
    user.pictureUrl +
    '\nMessage: '
  let messages = null
  switch (event.message.type) {
    case 'text':
      messages = [
        {
          type: 'text',
          text: text + event.message.text,
        },
      ]
      break
    case 'image':
      const buffer = await line.getMessageContent(event.message.id)
      const url = await s3.upload(buffer)
      messages = [
        {
          type: 'text',
          text: text + url,
        },
      ]
      break
    case 'location':
      messages = [
        {
          type: 'text',
          text,
        },
        {
          type: 'location',
          title: event.message.title ? event.message.title : 'Location',
          address: event.message.address,
          latitude: event.message.latitude,
          longitude: event.message.longitude,
        },
      ]
      break
    default:
      text += TextType.undefined
  }
  await line.pushMessage(process.env.LINE_MASTER_OF_BOT_GROUP_ID, messages)

  return true
}

module.exports = listener
