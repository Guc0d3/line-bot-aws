const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async botEvent => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.price) return false

  // get user
  const user = await logic.line.getProfileById(botEvent.source.userId)
  console.debug('user =', JSON.stringify(user, null, 2))

  // ban user prompt
  if (user.groupCode === env.messageGroup.banFriend) {
    console.log('This user is baned:', JSON.stringify(user))
    await tool.line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.banFriend
      }
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
    await tool.line.replyMessage(botEvent.replyToken, messages)
  }

  // expired user
  else {
    await tool.line.replyMessage(botEvent.replyToken, [
      {
        type: 'text',
        text: env.messageText.exipred
      },
      {
        type: 'text',
        text: env.messageText.registerDemoLink
      }
    ])
  }

  return true
}

module.exports = {
  get
}
