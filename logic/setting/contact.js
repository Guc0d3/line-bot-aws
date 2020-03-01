const tool = require('../../tool')

const get = async () => {
  let rows = await tool
    .db('setting')
    .where('option', 'CONTACT_IMAGE')
    .orWhere('option', 'CONTACT_MESSAGE')
  if (rows.length != 2) throw 'setting.contact is invalid'
  let contact = rows.reduce((total, row) => {
    if (row.option === 'CONTACT_IMAGE' && row.value) {
      return {
        ...total,
        image: row.value
      }
    }
    if (row.option === 'CONTACT_MESSAGE' && row.value) {
      return {
        ...total,
        text: row.value
      }
    }
  }, {})
  return contact
}

module.exports = {
  get
}
