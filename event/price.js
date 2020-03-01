const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message, friend) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.price) return false
  console.debug('[-] botEvent.price.get')
  if (friend.groupCode === env.messageGroup.banFriend) {
    console.log('This friend is baned:', JSON.stringify(friend))
    await logic.line.replyMessage(replyToken, [
      {
        type: 'text',
        text: env.messageText.banFriend
      }
    ])
    return true
  }
  const current = new Date()
  if (
    friend.groupCode === env.messageGroup.vipFriend ||
    current <= friend.expiredAt
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
          previewImageUrl: row.value
        })
      }
      if (row.option === 'PRICE_MESSAGE' && row.value) {
        total.push({
          type: 'text',
          text: row.value
        })
      }
      return total
    }, [])
    await logic.line.replyMessage(replyToken, messages)
  } else {
    await logic.line.replyMessage(replyToken, [
      {
        type: 'text',
        text: env.messageText.exipred[0]
      },
      {
        type: 'text',
        text: env.messageText.exipred[1]
      }
    ])
  }
  return true
}

module.exports = {
  get
}
