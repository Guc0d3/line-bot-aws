const moment = require('moment')
const database = require('../database')
const env = require('../env')
const line = require('../line')
const CommandType = require('../type/CommandType')
const UserType = require('../type/UserType')

moment.locale('th')

const get = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.register.get) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  let rows = await database('setting').where({ option: 'REGISTER_CODE' })
  if (rows.length != 1) return false
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'text',
      text: env.messageText.registerCode + ': ' + rows[0].value,
    },
  ])
  return true
}

const prompt = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.register.prompt) return false

  // get user
  const user = await line.getProfileById(botEvent.source.userId)

  let contents = null

  if (user.groupCode === UserType.vipFriend) {
    // create flex menu for VIP user
    contents = [
      {
        type: 'text',
        text: env.messageText.userIsVIP[0],
      },
      {
        type: 'text',
        text: env.messageText.userIsVIP[1],
      },
    ]
  } else {
    // create flex menu for another user
    let rows = await database('setting').where({ option: 'WEB_URL' })
    const registerUrl = rows[0].value + '/#/register?id=' + user.friendId
    contents = [
      {
        type: 'text',
        text: env.messageText.userIsExpiredAt[0],
      },
      {
        type: 'text',
        text:
          env.messageText.userIsExpiredAt[1] +
          ' ' +
          moment(user.expiredAt).format('DD MMMM YYYY'),
      },
      {
        type: 'button',
        style: 'primary',
        action: {
          type: 'uri',
          label: env.messageText.increaseExpireDate,
          uri: registerUrl,
        },
      },
    ]
  }

  // send flex menu to user
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'flex',
      altText: env.messageText.botSendMessage,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents,
        },
      },
    },
  ])

  return true
}

const random = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.register.random) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  await database('setting')
    .where({ option: 'REGISTER_CODE' })
    .update({ value: code })
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'text',
      text: env.messageText.randomRegisterCodeSuccess[0],
    },
    {
      type: 'text',
      text: env.messageText.randomRegisterCodeSuccess[1] + ': ' + code,
    },
  ])
  return true
}

const set = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (!/^([0-9]{6})$/.test(botEvent.message.text)) return false

  // get user
  const user = await line.getProfileById(botEvent.source.userId)

  // check register code
  let rows = await database('setting').where({
    option: 'REGISTER_CODE',
    value: botEvent.message.text,
  })
  if (rows.length != 1) return false

  // get active date by user groupcode
  let activeDate = 0
  if (user.groupCode === UserType.warningFriend) {
    rows = await database('setting').where({
      option: 'ACTIVE_DATE__WARNING_FRIEND',
    })
    activeDate = rows[0].value
  } else {
    rows = await database('setting').where({
      option: 'ACTIVE_DATE__FRIEND',
    })
    activeDate = rows[0].value
  }

  // set expired date
  let expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() + 1 + parseInt(activeDate, 10))
  await database('friend')
    .where('friend_id', user.friendId)
    .update({
      group_code:
        user.groupCode === UserType.newFriend
          ? UserType.friend
          : user.groupCode,
      expired_at: expiredAt.toISOString().substr(0, 10),
      updated_at: database.fn.now(),
    })

  // reply success message
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'text',
      text: env.messageText.registerSuccess,
    },
    {
      type: 'text',
      text: env.messageText.userIsExpiredAt[0],
    },
    {
      type: 'text',
      text:
        env.messageText.userIsExpiredAt[1] +
        ' ' +
        moment(expiredAt).format('DD MMMM YYYY'),
    },
  ])

  return true
}

module.exports = {
  get,
  prompt,
  random,
  set,
}
