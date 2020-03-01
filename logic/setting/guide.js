const tool = require('../../tool')

const get = async () => {
  let rows = await tool
    .db('setting')
    .where('option', 'GUIDE_IMAGE')
    .orWhere('option', 'GUIDE_MESSAGE')
  if (rows.length != 2) throw 'setting.guide is invalid'
  let guide = rows.reduce((total, row) => {
    if (row.option === 'GUIDE_IMAGE' && row.value) {
      return {
        ...total,
        image: row.value
      }
    }
    if (row.option === 'GUIDE_MESSAGE' && row.value) {
      return {
        ...total,
        text: row.value
      }
    }
  }, {})
  return guide
}

module.exports = {
  get
}
