const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const prompt = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.web.prompt) return false
  console.debug('[-] botEvent.web.prompt')
  let rows = await tool.db('setting').where({ option: 'WEB_URL' })
  if (rows.length !== 1) return false
  const uri = rows[0].value
  const line = logic.line.getClient()
  await line.replyMessage(replyToken, [
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
                label: env.messageText.webPrompt[0],
                uri: uri + '/#/friend'
              }
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: env.messageText.webPrompt[1],
                uri: uri + '/#/history'
              }
            },
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: env.messageText.webPrompt[2],
                uri: uri + '/#/setting'
              }
            }
          ]
        }
      }
    }
  ])
  return true
}

module.exports = {
  prompt
}
