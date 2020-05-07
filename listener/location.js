const database = require('../database')
const line = require('../line')
const CommandType = require('../Type/Command')

const listener = async (event) => {
  if (!event.message) return false
  if (event.message.type !== 'text') return false
  if (event.message.text !== CommandType.location) return false
  console.debug('call listener.location')
  let location = {}
  let rows = await database('setting').where('option', 'LOCATION_ADDRESS')
  location.address = rows[0].value
  rows = await database('setting').where('option', 'LOCATION_LATITUDE')
  location.latitude = parseFloat(rows[0].value)
  rows = await database('setting').where('option', 'LOCATION_LONGITUDE')
  location.longitude = parseFloat(rows[0].value)
  rows = await database('setting').where('option', 'LOCATION_TITLE')
  location.title = rows[0].value
  await line.replyMessage(event.replyToken, [
    {
      type: 'location',
      ...location,
    },
  ])
  return true
}

module.exports = listener
