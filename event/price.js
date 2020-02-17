const env = require('../env')
const tool = require('../tool')

const get = async (replyToken, message, friend) => {
  console.log('[-] botEvent.price.get')
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.price) return false
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  if (friend.groupCode === env.messageGroup.banFriend) {
    console.debug('This friend is baned:', JSON.stringify(friend))
    await line.replyMessage(replyToken, [
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
    let rows = await tool.db('setting')
      .where('option', 'PRICE_IMAGE')
      .orWhere('option', 'PRICE_MESSAGE')
      .orderBy('option')
    if (rows.length != 2) return false
    console.debug('rows', rows)
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
    console.debug('messages', messages)
    await line.replyMessage(replyToken, messages)
  } else {
    await line.replyMessage(replyToken, [
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
