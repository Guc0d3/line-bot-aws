const moment = require('moment')
const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/CommandType')
const TextType = require('../Type/TextType')
const UserType = require('../Type/UserType')

moment.locale('th')

const getCode = async (botEvent) => {
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
      text: TextType.registerCode + ': ' + rows[0].value,
    },
  ])
  return true
}

const getPrompt = async (botEvent) => {
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
        text: TextType.userIsVIP[0],
      },
      {
        type: 'text',
        text: TextType.userIsVIP[1],
      },
    ]
  } else {
    // create flex menu for another user
    let rows = await database('setting').where({ option: 'WEB_URL' })
    const registerUrl = rows[0].value + '/#/register?id=' + user.friendId
    contents = [
      {
        type: 'text',
        text: TextType.userIsExpiredAt[0],
      },
      {
        type: 'text',
        text:
          TextType.userIsExpiredAt[1] +
          ' ' +
          moment(user.expiredAt).format('DD MMMM YYYY'),
      },
      {
        type: 'button',
        style: 'primary',
        action: {
          type: 'uri',
          label: TextType.reNewMembership,
          uri: registerUrl,
        },
      },
    ]
  }
  // send flex menu to user
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'flex',
      altText: TextType.botSendMessage,
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

const randomCode = async (botEvent) => {
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
      text: TextType.randomRegisterCodeSuccess[0],
    },
    {
      type: 'text',
      text: TextType.randomRegisterCodeSuccess[1] + ': ' + code,
    },
  ])
  return true
}

const activate = async (botEvent) => {
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
      text: TextType.registerIsSuccessed,
    },
    {
      type: 'text',
      text: TextType.userIsExpiredAt[0],
    },
    {
      type: 'text',
      text:
        TextType.userIsExpiredAt[1] +
        ' ' +
        moment(expiredAt).format('DD MMMM YYYY'),
    },
  ])
  return true
}

module.exports = {
  activate,
  getCode,
  getPrompt,
  randomCode,
}