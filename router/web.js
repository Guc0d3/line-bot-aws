const database = require('../database')
const env = require('../env')
const line = require('../line')

const prompt = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== env.messageEvent.web.prompt) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  let rows = await database('setting').where({ option: 'WEB_URL' })
  if (rows.length !== 1) return false
  const uri = rows[0].value
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'flex',
      altText: 'bot send web menu',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: env.messageText.friend,
                uri: uri + '/#/friend',
              },
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: env.messageText.history,
                uri: uri + '/#/history',
              },
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: env.messageText.setting,
                uri: uri + '/#/setting',
              },
            },
          ],
        },
      },
    },
  ])
  return true
}

module.exports = {
  prompt,
}
