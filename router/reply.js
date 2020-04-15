const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

var replyMode = 0
var friend = null
var friendId = null

const set = async botEvent => {
  if (!botEvent.message) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  if (replyMode === 0) {
    if (botEvent.message.type !== 'text') return false
    // if (!botEvent.message.text.startsWith(env.messageEvent.reply)) return false
    // const displayName = botEvent.message.text.substring(
    //   env.messageEvent.reply.length,
    //   botEvent.message.text.length
    // )
    const displayName = botEvent.message.text
      .split('\n')[0]
      .split(':')[1]
      .trim()
    console.debug('displayName', displayName)
    friend = await logic.line.getProfileByName(displayName)
    if (friend == null) {
      await tool.line.replyMessage(botEvent.replyToken, [
        {
          type: 'text',
          text: 'name of friend is mismatched'
        }
      ])
      replyMode = 0
      return true
    }
    friendId = friend.friendId
    console.debug('friend', JSON.stringify(friend))
    console.debug('friendId', friendId)
    await tool.line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: 'wait reply message ...'
      }
    ])
    replyMode = 1
  } else if (replyMode === 1) {
    console.debug('replyMode = 1')
    console.debug('friend', JSON.stringify(friend))
    console.debug('friendId', friendId)

    if (botEvent.message.type === 'text') {
      await tool.line.pushMessage(friend.friendId, [
        {
          type: 'text',
          text: botEvent.message.text
        }
      ])
    } else if (
      botEvent.message.type === 'image' ||
      botEvent.message.type === 'video'
    ) {
      const buffer = await tool.line.getMessageContent(botEvent.message.id)
      const url = await logic.s3.uploadBuffer(buffer)
      await tool.line.pushMessage(friend.friendId, [
        {
          type: botEvent.message.type,
          originalContentUrl: url,
          previewImageUrl: url
        }
      ])
    }

    await tool.line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: 'reply message complete'
      }
    ])
    replyMode = 0
  } else {
    return false
  }
  return true
}

module.exports = {
  set
}
