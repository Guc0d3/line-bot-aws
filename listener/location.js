const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/CommandType')

const listener = async (botEvent) => {
  if (!botEvent.message) return false
  if (botEvent.message.type !== 'text') return false
  if (botEvent.message.text !== CommandType.location) return false
  let location = {}
  let rows = await database('setting').where('option', 'LOCATION_ADDRESS')
  location.address = rows[0].value
  rows = await database('setting').where('option', 'LOCATION_LATITUDE')
  location.latitude = parseFloat(rows[0].value)
  rows = await database('setting').where('option', 'LOCATION_LONGITUDE')
  location.longitude = parseFloat(rows[0].value)
  rows = await database('setting').where('option', 'LOCATION_TITLE')
  location.title = rows[0].value
  await line.replyMessage(botEvent.replyToken, [
    {
      type: 'location',
      ...location,
    },
  ])
  return true
}

module.exports = listener
