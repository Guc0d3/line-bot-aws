const env = require('../env')
const logic = require('../logic')
const tool = require('../tool')

const get = async (replyToken, message) => {
  if (!message) return false
  if (message.type !== 'text') return false
  if (message.text !== env.messageEvent.location) return false
  console.debug('[-] botEvent.location.get')
  let location = {}
  let rows = await tool.db('setting').where('option', 'LOCATION_ADDRESS')
  location.address = rows[0].value
  rows = await tool.db('setting').where('option', 'LOCATION_LATITUDE')
  location.latitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_LONGITUDE')
  location.longitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_TITLE')
  location.title = rows[0].value
  await tool.line.replyMessage(replyToken, [
    {
      type: 'location',
      ...location
    }
  ])
  return true
}

module.exports = {
  get
}
