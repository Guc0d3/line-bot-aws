const env = require('../env')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.location) return false
  // console.log('[-] botEvent.location.get')
  let rows = await tool.db('setting').where('option', 'LOCATION_ADDRESS')
  let address = rows[0].value
  rows = await tool.db('setting').where('option', 'LOCATION_LATITUDE')
  let latitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_LONGITUDE')
  let longitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_TITLE')
  let title = rows[0].value
  const line = await tool.line.getClient(process.env.LINE_CHANNEL_ACCESS_TOKEN)
  await line.replyMessage(replyToken, [
    {
      type: 'location',
      title,
      address,
      latitude,
      longitude
    }
  ])
  return true
}

module.exports = {
  get
}
