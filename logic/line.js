const lodash = require('lodash')
const env = require('../env')
const tool = require('../tool')

var line = null

const getClient = () => {
  console.debug('[-] logic.line.getClient')
  if (line == null) {
    line = tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  }
  return line
}

const getMessageContent = async id => {
  console.debug('[-] logic.line.getMessageContent')
  const line = getClient()
  const buffer = await tool.line.getMessageContent(line, id)
  return buffer
}

const getProfileById = async id => {
  console.debug('[-] logic.line.getProfileById')
  const line = getClient()
  let friend = await line.getProfile(id)
  friend.friendId = friend.userId
  delete friend.userId
  let rows = await tool.db('friend').where('friend_id', id)
  if (rows.length == 0) {
    rows = await tool.db('setting').where({ option: 'ACTIVE_DATE__NEW_FRIEND' })
    const activeDateNewFriend = parseInt(rows[0].value, 10)
    friend.expiredAt = new Date()
    friend.expiredAt.setDate(
      friend.expiredAt.getDate() + 1 + activeDateNewFriend
    )
    await tool.db('friend').insert({
      display_name: friend.displayName,
      expired_at: friend.expiredAt.toISOString().substr(0, 10),
      friend_id: friendId,
      name: friend.displayName,
      group_code: env.messageGroup.newFriend,
      picture_url: friend.pictureUrl,
      status_message: friend.statusMessage
    })
    friend.groupCode = env.messageGroup.newFriend
  } else {
    friend.expiredAt = new Date(rows[0].expired_at)
    await tool
      .db('friend')
      .where('friend_id', id)
      .update({
        display_name: friend.displayName,
        picture_url: friend.pictureUrl,
        status_message: friend.statusMessage,
        updated_at: tool.db.fn.now()
      })
    friend.groupCode = rows[0].group_code
  }
  return friend
}

const getProfileByName = async name => {
  console.debug('[-] logic.line.getProfileByName')
  let rows = await tool
    .db('friend')
    .where('display_name', name)
    .orderBy('updated_at', 'desc')
  console.debug('rows', JSON.stringify(rows))
  if (rows.length !== 1) return null
  return lodash.mapKeys(rows[0], (v, k) => lodash.camelCase(k))
}

module.exports = {
  getClient,
  getMessageContent,
  getProfileById,
  getProfileByName
}
