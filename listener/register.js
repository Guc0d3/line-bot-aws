const moment = require('moment')
const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/CommandType')
const TextType = require('../Type/TextType')
const UserType = require('../Type/UserType')

moment.locale('th')

const activate = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (!/^([0-9]{6})$/.test(event.message.text)) return false
  console.debug('call listener.register.activate')
  // get user
  const user = await line.getProfileById(event.source.userId)
  // check register code
  let rows = await database('setting').where({
    option: 'REGISTER_CODE',
    value: event.message.text,
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
  await line.replyMessage(event.replyToken, [
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

const getCode = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.register.getCode) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  console.debug('call listener.register.getCode')
  let rows = await database('setting').where({ option: 'REGISTER_CODE' })
  if (rows.length != 1) return false
  await line.replyMessage(event.replyToken, [
    {
      type: 'text',
      text: TextType.registerCode + ' ' + rows[0].value,
    },
  ])
  return true
}

const getPrompt = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.register.getPrompt) return false
  console.debug('call listener.register.getPrompt')
  // get user
  const user = await line.getProfileById(event.source.userId)
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
  await line.replyMessage(event.replyToken, [
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

const randomCode = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.register.randomCode) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  console.debug('call listener.register.randomCode')
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  await database('setting')
    .where({ option: 'REGISTER_CODE' })
    .update({ value: code })
  await line.replyMessage(event.replyToken, [
    {
      type: 'text',
      text: TextType.randomRegisterCodeSuccess[0],
    },
    {
      type: 'text',
      text: TextType.randomRegisterCodeSuccess[1] + ' ' + code,
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
