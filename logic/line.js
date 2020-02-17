const env = require('../env')
const tool = require('../tool')

const getFriendProfile = async friendId => {
  console.debug('[-] getFriendProfile')
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  let friend = await line.getProfile(friendId)
  friend.friendId = friend.userId
  delete friend.userId
  let rows = await tool.db('friend').where('friend_id', friendId)
  if (rows.length == 0) {
    console.debug('insert friend')
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
    console.debug('update friend')
    friend.expiredAt = new Date(rows[0].expired_at)
    await tool.db('friend')
      .where('friend_id', friendId)
      .update({
        display_name: friend.displayName,
        picture_url: friend.pictureUrl,
        status_message: friend.statusMessage,
        updated_at: tool.db.fn.now()
      })
    friend.groupCode = rows[0].group_code
  }
  console.debug('friend:', JSON.stringify(friend))
  console.debug('friend:', JSON.stringify(friend))
  return friend
}

module.exports = {
  getFriendProfile
}
