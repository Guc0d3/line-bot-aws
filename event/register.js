const moment = require('moment')
const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

moment.locale('th')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.register.get) return false
  console.debug('[-] botEvent.register.get')
  let rows = await tool.db('setting').where({ option: 'REGISTER_CODE' })
  if (rows.length != 1) return false
  await logic.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.registerPrompt[9] + rows[0].value
    }
  ])
  return true
}

const prompt = async (replyToken, message, friend) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.register.prompt) return false
  console.debug('[-] botEvent.register.prompt')
  let contents = null
  if (friend.groupCode === env.messageGroup.vipFriend) {
    contents = [
      {
        type: 'text',
        text: env.messageText.registerPrompt[0]
      },
      {
        type: 'text',
        text: env.messageText.registerPrompt[1]
      }
    ]
  } else {
    let rows = await tool.db('setting').where({ option: 'WEB_URL' })
    const registerUrl = rows[0].value + '/#/register?id=' + friend.friendId
    contents = [
      {
        type: 'text',
        text: env.messageText.registerPrompt[2]
      },
      {
        type: 'text',
        text:
          env.messageText.registerPrompt[3] +
          ' ' +
          moment(friend.expiredAt).format('DD MMMM YYYY')
      },
      {
        type: 'button',
        style: 'primary',
        action: {
          type: 'uri',
          label: env.messageText.registerPrompt[4],
          uri: registerUrl
        }
      }
    ]
  }
  await logic.line.replyMessage(replyToken, [
    {
      type: 'flex',
      altText: env.messageText.registerPrompt[5],
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
  // console.log('[-] botEvent.register.random')
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  let result = await tool
    .db('setting')
    .where({ option: 'REGISTER_CODE' })
    .update({ value: code })
  await logic.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.registerPrompt[7]
    },
    {
      type: 'text',
      text: env.messageText.registerPrompt[8] + code
    }
  ])
  return true
}

const set = async (replyToken, message, friend) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (!/^([0-9]{6})$/.test(message.text)) return false
  // console.log('[-] botEvent.register.set')
  let rows = await tool.db('setting').where({
    option: 'REGISTER_CODE',
    value: message.text
  })
  if (rows.length != 1) return false
  let activeDate = 0
  if (friend.groupCode === env.messageGroup.warningFriend) {
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
    .where('friend_id', friend.friendId)
    .update({
      group_code:
        friend.groupCode === env.messageGroup.newFriend
          ? env.messageGroup.friend
          : friend.groupCode,
      expired_at: expiredAt.toISOString().substr(0, 10),
      updated_at: tool.db.fn.now()
    })
  await logic.line.replyMessage(replyToken, [
    {
      type: 'text',
      text: env.messageText.registerPrompt[6]
    },
    {
      type: 'text',
      text: env.messageText.registerPrompt[2]
    },
    {
      type: 'text',
      text:
        env.messageText.registerPrompt[3] +
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
