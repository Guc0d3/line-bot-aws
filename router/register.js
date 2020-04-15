const moment = require('moment')
const env = require('../env')
const tool = require('../tool')

moment.locale('th')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.register.get) return false
  let rows = await tool.db('setting').where({ option: 'REGISTER_CODE' })
  if (rows.length != 1) return false
  await tool.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.registerCode + ': ' + rows[0].value
    }
  ])
  return true
}

const prompt = async (replyToken, message, user) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.register.prompt) return false
  let contents = null
  if (user.groupCode === env.messageGroup.vipFriend) {
    contents = [
      {
        type: 'text',
        text: env.messageText.userIsVIP[0]
      },
      {
        type: 'text',
        text: env.messageText.userIsVIP[1]
      }
    ]
  } else {
    let rows = await tool.db('setting').where({ option: 'WEB_URL' })
    const registerUrl = rows[0].value + '/#/register?id=' + user.friendId
    contents = [
      {
        type: 'text',
        text: env.messageText.userIsExpiredAt[0]
      },
      {
        type: 'text',
        text:
          env.messageText.userIsExpiredAt[1] +
          ' ' +
          moment(user.expiredAt).format('DD MMMM YYYY')
      },
      {
        type: 'button',
        style: 'primary',
        action: {
          type: 'uri',
          label: env.messageText.increaseExpireDate,
          uri: registerUrl
        }
      }
    ]
  }
  await tool.line.replyMessage(replyToken, [
    {
      type: 'flex',
      altText: env.messageText.botSendMessage,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents
        }
      }
    }
  ])
  return true
}

const random = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.register.random) return false
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  let result = await tool
    .db('setting')
    .where({ option: 'REGISTER_CODE' })
    .update({ value: code })
  await tool.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.randomRegisterCodeSuccess[0]
    },
    {
      type: 'text',
      text: env.messageText.randomRegisterCodeSuccess[1] + ': ' + code
    }
  ])
  return true
}

const set = async (replyToken, message, user) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (!/^([0-9]{6})$/.test(message.text)) return false
  let rows = await tool.db('setting').where({
    option: 'REGISTER_CODE',
    value: message.text
  })
  if (rows.length != 1) return false
  let activeDate = 0
  if (user.groupCode === env.messageGroup.warningFriend) {
    rows = await tool.db('setting').where({
      option: 'ACTIVE_DATE__WARNING_FRIEND'
    })
    activeDate = rows[0].value
  } else {
    rows = await tool.db('setting').where({
      option: 'ACTIVE_DATE__FRIEND'
    })
    activeDate = rows[0].value
  }
  let expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() + 1 + parseInt(activeDate, 10))
  await tool
    .db('friend')
    .where('friend_id', user.friendId)
    .update({
      group_code:
        user.groupCode === env.messageGroup.newFriend
          ? env.messageGroup.friend
          : user.groupCode,
      expired_at: expiredAt.toISOString().substr(0, 10),
      updated_at: tool.db.fn.now()
    })
  await tool.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.registerSuccess
    },
    {
      type: 'text',
      text: env.messageText.userIsExpiredAt[0]
    },
    {
      type: 'text',
      text:
        env.messageText.userIsExpiredAt[1] +
        ' ' +
        moment(expiredAt).format('DD MMMM YYYY')
    }
  ])
  return true
}

module.exports = {
  get,
  prompt,
  random,
  set
}
