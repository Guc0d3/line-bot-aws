const moment = require('moment')

const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')
const LineBotFactory = require('../factory/LineBotFactory')
const lineBot = LineBotFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.price) return false

  // get user
  const user = await lineBot.getProfileById(botEvent.source.userId)

  // ban user prompt
  if (user.groupCode === env.messageGroup.banFriend) {
    console.log('This user is baned:', JSON.stringify(user))
    await lineBot.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.banFriend,
      },
    ])
    return true
  }

  const current = new Date()

  // not expired or vip user
  if (
    user.groupCode === env.messageGroup.vipFriend ||
    current <= user.expiredAt
  ) {
    let rows = await tool
      .db('setting')
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

    await lineBot.replyMessage(botEvent.replyToken, messages)
  }

  // expired user
  else {
    await lineBot.replyMessage(botEvent.replyToken, [
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
