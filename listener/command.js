const line = require('../line')
const CommandType = require('../Type/CommandType')

const listener = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.command) return false
  if (botEvent.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID)
    return false
  console.log('test command')
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
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'button',
                  type: 'text',
                  text: 'hello, world',
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'uri',
                    label: 'TextType.friend',
                    uri: '/#/friend',
                  },
                },
                {
                  type: 'button',
                  style: 'primary',
                  action: {
                    type: 'uri',
                    label: 'TextType.history',
                    uri: '/#/history',
                  },
                },
              ],
              backgroundColor: '#ffffff',
            },
            // {
            //   type: 'box',
            //   layout: 'horizontal',
            //   contents: [
            //     {
            //       type: 'text',
            //       text: 'hello, world',
            //     },
            //     {
            //       type: 'button',
            //       style: 'primary',
            //       action: {
            //         type: 'uri',
            //         label: 'TextType.friend',
            //         uri: '/#/friend',
            //       },
            //     },
            //     {
            //       type: 'button',
            //       style: 'primary',
            //       action: {
            //         type: 'uri',
            //         label: 'TextType.history',
            //         uri: '/#/history',
            //       },
            //     },
            //   ],
            //   backgroundColor: '#000000',
            // },
          ],
        },
      },
    },
  ])
  return true
}

module.exports = listener
