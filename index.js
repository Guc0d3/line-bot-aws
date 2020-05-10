const line = require('./line')
const listener = require('./listener')

if (process.env.APP_ENV === 'production') {
  // production no log
  console.log = () => {}
  console.debug = () => {}
} else if (process.env.APP_ENV === 'debug') {
  // no redirect console.log && console.debug
} else {
  // 'test'
  console.debug = () => {}
}

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
exports.handler = async (event) => {
  // log event info
  const botEvent = event.events[0]
  console.debug('botEvent =', JSON.stringify(botEvent, null, 2))
  const user = await line.getProfileById(botEvent.source.userId)
  console.debug('user =', JSON.stringify(user, null, 2))
  // listener
  let noEvent = false
  if (
    event.source.groupId &&
    event.source.groupId !== process.env.LINE_MASTER_OF_BOT_GROUP_ID
  ) {
    // private listener
    const privateWorks = [
      await listener.price(botEvent),
      await listener.holiday(botEvent),
      await listener.location(botEvent),
      await listener.guide(botEvent),
      await listener.register.getPrompt(botEvent),
      await listener.register.activate(botEvent),
      await listener.contact(botEvent),
    ]
    noEvent = !privateWorks.reduce((result, work) => {
      return result || work
    }, false)
  } else {
    // public listener
    const publicWorks = [
      await listener.price(botEvent),
      await listener.holiday(botEvent),
      await listener.location(botEvent),
      await listener.guide(botEvent),
      await listener.register.getPrompt(botEvent),
      await listener.register.activate(botEvent),
      await listener.contact(botEvent),
    ]
    noEvent = !publicWorks.reduce((result, work) => {
      return result || work
    }, false)
  }
  // echo other event
  if (noEvent) {
    await listener.echo(botEvent)
  }
}
