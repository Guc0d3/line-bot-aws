const botEvent = require('./event')
const logic = require('./logic')

if (process.env.APP_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
} else if (process.env.APP_ENV === 'debug') {
  // no redirect console.log && console.debug
} else {
  // 'test'
  console.debug = () => {}
}

exports.handler = async event => {
  console.log('[-] botEvent')
  // basic event
  // {
  //   "events": [{
  //     "type": "message",
  //     "replyToken": "50781340b00541cc...",
  //     "source": {
  //       "userId": "U3c28a70ed7c5e7ce2...",
  //       "groupId": "U3c28a70ed7c5e7ce2...",
  //       "type": "user" // or "group" or "room"
  //     },
  //     "timestamp": 1546848285013,
  //     "message": {
  //       "type": "text",
  //       "id": "9141452766858",
  //       "text": "Hello, world!"
  //     }
  //   }],
  //   "destination": "U820116ffcbe3f3ca7..."
  // }
  const message = event.events[0].message
  const userId = event.events[0].source.userId
  const groupId = event.events[0].source.groupId
  const replyToken = event.events[0].replyToken
  console.debug('message', JSON.stringify(message))
  console.debug('userId', userId)
  console.debug('replyToken', replyToken)

  const user = await logic.line.getProfileById(userId)
  console.log('user.displayName', user.displayName)
  console.log('user.pictureUrl', user.pictureUrl)

  const works = [
    // public event
    await botEvent.price.get(replyToken, message, user),
    await botEvent.holiday.get(replyToken, message),
    await botEvent.location.get(replyToken, message),
    await botEvent.guide.get(replyToken, message),
    await botEvent.register.prompt(replyToken, message, user),
    await botEvent.contact.get(replyToken, message),
    // private event
    await botEvent.register.get(replyToken, message),
    await botEvent.register.random(replyToken, message),
    await botEvent.register.set(replyToken, message, user),
    await botEvent.reply.set(replyToken, message),
    await botEvent.web.prompt(replyToken, message)
  ]
  const noEvent = !works.reduce((result, work) => {
    return result || work
  }, false)
  if (noEvent && groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID) {
    await botEvent.noEvent(replyToken, message, user)
  }
}
