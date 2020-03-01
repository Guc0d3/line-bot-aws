const tool = require('../../tool')

const get = async () => {
  let rows = await tool
    .db('setting')
    .where('option', 'HOLIDAY_IMAGE')
    .orWhere('option', 'HOLIDAY_MESSAGE')
  if (rows.length != 2) throw 'setting.holiday is invalid'
  let holiday = rows.reduce((total, row) => {
    if (row.option === 'HOLIDAY_IMAGE' && row.value) {
      return {
        ...total,
        image: row.value
      }
    }
    if (row.option === 'HOLIDAY_MESSAGE' && row.value) {
      return {
        ...total,
        text: row.value
      }
    }
  }, {})
  return holiday
}

module.exports = {
  get
}
