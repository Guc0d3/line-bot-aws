const line = require('../line')
const CommandType = require('../Type/CommandType')
const TextType = require('../Type/TextType')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.command) return false
  if (event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  // const uri = 'http://www.google.com'
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
                    label: 'เวป',
                    text: CommandType.register.web,
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
            // {
            //   type: 'button',
            //   style: 'primary',
            //   action: {
            //     type: 'message',
            //     label: 'รหัสสมาชิก',
            //     text: CommandType.register.getCode,
            //   },
            // },
            // {
            //   type: 'button',
            //   style: 'primary',
            //   action: {
            //     type: 'uri',
            //     label: TextType.history,
            //     uri: uri + '/#/history',
            //   },
            // },
            // {
            //   type: 'button',
            //   style: 'primary',
            //   action: {
            //     type: 'uri',
            //     label: TextType.setting,
            //     uri: uri + '/#/setting',
            //   },
            // },
          ],
        },
      },
    },
  ])
  return true
}

module.exports = listener
