const moment = require('moment')
const database = require('../database')
const env = require('../env')
const line = require('../line')
const CommandType = require('../Type/CommandType')
const UserType = require('../Type/UserType')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.price) return false

  // get user
  const user = await line.getProfileById(botEvent.source.userId)

  // ban user prompt
  if (user.groupCode === UserType.banFriend) {
    console.log('This user is baned:', JSON.stringify(user))
    await line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.banFriend,
      },
    ])
    return true
  }

  const current = new Date()

  // not expired or vip user
  if (user.groupCode === UserType.vipFriend || current <= user.expiredAt) {
    let rows = await database('setting')
      .where('option', 'PRICE_IMAGE')
      .orWhere('option', 'PRICE_MESSAGE')
      .orderBy('option')
    if (rows.length != 2) return false
    let messages = rows.reduce((total, row) => {
      if (row.option === 'PRICE_IMAGE' && row.value) {
        total.push({
          type: 'image',
          originalContentUrl: row.value,
          previewImageUrl: row.value,
        })
      }
      if (row.option === 'PRICE_MESSAGE' && row.value) {
        total.push({
          type: 'text',
          text: row.value,
        })
      }
      return total
    }, [])

    // add message to user when nearly expired date
    if (moment(user.expiredAt).diff(moment(new Date()), 'days') <= 5) {
      messages.push({
        type: 'text',
        text: env.messageText.userNearlyExpired,
      })
    }

    await line.replyMessage(botEvent.replyToken, messages)
  }

  // expired user
  else {
    await line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.exipred,
      },
      {
        type: 'text',
        text: env.messageText.registerDemoLink,
      },
    ])
  }

  return true
}

module.exports = {
  get,
}
