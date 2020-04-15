const logic = require('./logic')
const router = require('./router')
const tool = require('./tool')

if (process.env.APP_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
} else if (process.env.APP_ENV === 'debug') {
  // no redirect console.log && console.debug
} else {
  // 'test'
  console.debug = () => {}
}

tool.line.create(process.env.LINE_CHANNEL_ACCESS_TOKEN)

exports.handler = async event => {
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
  const botEvent = event.events[0]
  console.debug('botEvent =', JSON.stringify(botEvent, null, 2))

  const user = await logic.line.getProfileById(botEvent.source.userId)
  console.debug('user =', JSON.stringify(user, null, 2))

  const works = [
    // public router
    await router.price.get(botEvent),
    await router.holiday.get(botEvent),
    await router.location.get(botEvent),
    await router.guide.get(botEvent),
    await router.register.prompt(botEvent.replyToken, botEvent.message, user),
    await router.contact.get(botEvent),
    // private router
    await router.register.get(botEvent.replyToken, botEvent.message),
    await router.register.random(botEvent.replyToken, botEvent.message),
    await router.register.set(botEvent.replyToken, botEvent.message, user),
    await router.reply.set(botEvent),
    await router.web.prompt(botEvent)
  ]
  const noEvent = !works.reduce((result, work) => {
    return result || work
  }, false)
  if (noEvent) {
    await router.echo(botEvent)
  }
}
