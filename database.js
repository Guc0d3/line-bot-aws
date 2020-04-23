const DatabaseFactory = require('./Factory/Database')

const database = DatabaseFactory(
  process.env.POSTGRESQL_HOST,
  process.env.POSTGRESQL_USER,
  process.env.POSTGRESQL_PASSWORD,
  process.env.POSTGRESQL_DATABASE,
)

module.exports = database
