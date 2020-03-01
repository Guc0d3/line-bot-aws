const tool = require('../../tool')

const get = async () => {
  let rows = await tool.db('setting').where('option', 'LOCATION_ADDRESS')
  let address = rows[0].value
  rows = await tool.db('setting').where('option', 'LOCATION_LATITUDE')
  let latitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_LONGITUDE')
  let longitude = parseFloat(rows[0].value)
  rows = await tool.db('setting').where('option', 'LOCATION_TITLE')
  let title = rows[0].value
  return {
    title,
    address,
    latitude,
    longitude
  }
}

module.exports = {
  get
}
