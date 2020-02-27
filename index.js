const botEvent = require('./event')
const logic = require('./logic')

const appEnv = process.env.APP_ENV
if (appEnv === 'production') {
  console.log = () => {}
  console.debug = () => {}
}

exports.handler = async event => {
  const friendId = event.events[0].source.userId
  const message = event.events[0].message
  const replyToken = event.events[0].replyToken
  console.log('[-] botEvent')
  // console.debug('friendId:', friendId)
  // console.debug('message:', message)
  // console.debug('replyToken:', replyToken)

  const friend = await logic.line.getFriendProfile(friendId)

  const works = [
    // public event
    await botEvent.price.get(replyToken, message, friend),
    await botEvent.holiday.get(replyToken, message),
    await botEvent.location.get(replyToken, message),
    await botEvent.guide.get(replyToken, message),
    await botEvent.register.prompt(replyToken, message, friend),
    await botEvent.contact.get(replyToken, message),
    // private event
    await botEvent.register.get(replyToken, message),
    await botEvent.register.random(replyToken, message),
    await botEvent.register.set(replyToken, message, friend),
    await botEvent.reply.set(replyToken, message),
    await botEvent.web.prompt(replyToken, message)
  ]
  const noEvent = !works.reduce((result, work) => {
    return result || work
  }, false)
  if (noEvent) {
    await botEvent.noEvent(replyToken, message, friend)
  }
}
