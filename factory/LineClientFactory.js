const lineBotSdk = require('@line/bot-sdk')
const lodash = require('lodash')
const DatabaseFactory = require('../factory/DatabaseFactory')
const database = DatabaseFactory()

const myBehaviors = (self) => ({
  getProfileById: async (userId) => {
    let friend = await self.client.getProfile(userId)
    friend.friendId = friend.userId
    delete friend.userId
    let rows = await database('friend').where('friend_id', userId)
    if (rows.length == 0) {
      rows = await database('setting').where({
        option: 'ACTIVE_DATE__NEW_FRIEND',
      })
      const activeDateNewFriend = parseInt(rows[0].value, 10)
      friend.expiredAt = new Date()
      friend.expiredAt.setDate(
        friend.expiredAt.getDate() + 1 + activeDateNewFriend,
      )
      await database('friend').insert({
        display_name: friend.displayName,
        expired_at: friend.expiredAt.toISOString().substr(0, 10),
        friend_id: userId,
        name: friend.displayName,
        group_code: env.messageGroup.newFriend,
        picture_url: friend.pictureUrl,
        status_message: friend.statusMessage,
      })
      friend.groupCode = env.messageGroup.newFriend
    } else {
      friend.expiredAt = new Date(rows[0].expired_at)
      await database('friend').where('friend_id', userId).update({
        display_name: friend.displayName,
        picture_url: friend.pictureUrl,
        status_message: friend.statusMessage,
        updated_at: database.fn.now(),
      })
      friend.groupCode = rows[0].group_code
    }
    return friend
  },
  getProfileByName: async (userDisplayName) => {
    let rows = await database('friend')
      .where('display_name', userDisplayName)
      .orderBy('updated_at', 'desc')
    return lodash.mapKeys(rows[0], (v, k) => lodash.camelCase(k))
  },
})

const LineClientFactory = (channelAccessToken) => {
  const self = {
    client: new lineBotSdk.Client({ channelAccessToken }),
  }
  const behaviors = (self) => ({
    getMessageContent: async (messageId) => {
      return new Promise((resolve, reject) => {
        self.client.getMessageContent(messageId).then((stream) => {
          var content = []
          stream
            .on('data', (chunk) => {
              content.push(new Buffer.from(chunk))
            })
            .on('error', (error) => {
              reject(error)
            })
            .on('end', function () {
              resolve(Buffer.concat(content))
            })
        })
      })
    },
    getProfile: async (userId) => {
      return await self.client.getProfile(userId)
    },
    pushMessage: async (to, messages) => {
      return await self.client.pushMessage(to, messages)
    },
    replyMessage: async (replyToken, messages) => {
      return await self.client.replyMessage(replyToken, messages)
    },
  })
  return Object.assign(self, behaviors(self), myBehaviors(self))
}

module.exports = LineClientFactory
