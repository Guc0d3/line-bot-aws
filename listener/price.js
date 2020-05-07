const moment = require('moment')
const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/Command')
const TextType = require('../Type/Text')
const UserType = require('../Type/User')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.price) return false
  console.debug('call listener.price')
  // get user
  const user = await line.getProfileById(event.source.userId)
  // ban user prompt
  if (user.groupCode === UserType.banFriend) {
    console.log('This user is baned:', JSON.stringify(user))
    await line.replyMessage(event.replyToken, [
      {
        type: 'text',
        text: TextType.userIsBaned,
      },
    ])
    return true
  }
  // not expired or vip user
  const current = new Date()
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
        text: TextType.userIsExpiringSoon,
      })
    }

    await line.replyMessage(event.replyToken, messages)
  }
  // expired user
  else {
    await line.replyMessage(event.replyToken, [
      {
        type: 'text',
        text: TextType.userIsExpired,
      },
      {
        type: 'text',
        text: TextType.registerDemoLink,
      },
    ])
  }
  return true
}

module.exports = listener
