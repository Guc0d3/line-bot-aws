const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/CommandType')
const TextType = require('../Type/TextType')

const prompt = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.web) return false
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
                label: TextType.friend,
                uri: uri + '/#/friend',
              },
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: TextType.history,
                uri: uri + '/#/history',
              },
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: TextType.setting,
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
