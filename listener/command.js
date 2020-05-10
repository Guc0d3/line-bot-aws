const line = require('../line')
const CommandType = require('../Type/Command')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.command) return false
  console.debug('call listener.command')
  await line.replyMessage(event.replyToken, [
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
              type: 'box',
              layout: 'horizontal',
              spacing: 'md',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'สุ่มรหัสสมาชิก',
                    text: CommandType.register.randomCode,
                  },
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'รหัสสมาชิก',
                    text: CommandType.register.getCode,
                  },
                },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'md',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'เปิดบอท',
                    text: CommandType.on,
                  },
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'ปิดบอท',
                    text: CommandType.off,
                  },
                },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'md',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'เวป',
                    text: CommandType.web,
                  },
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'message',
                    label: 'คู่มือ',
                    text: CommandType.help,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ])
  return true
}

module.exports = listener
