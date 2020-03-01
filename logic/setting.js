const tool = require('../tool')

const getContact = async () => {
  let rows = await tool
    .db('setting')
    .where('option', 'CONTACT_IMAGE')
    .orWhere('option', 'CONTACT_MESSAGE')
  if (rows.length != 2) return false
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
  getContact
}
