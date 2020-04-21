const KnexQueryBuilder = require('knex/lib/query/builder')
const lodash = require('lodash')

const HOST = process.env.POSTGRESQL_HOST
const USER = process.env.POSTGRESQL_USER
const PASSWORD = process.env.POSTGRESQL_PASSWORD
const DATABASE = process.env.POSTGRESQL_DATABASE

KnexQueryBuilder.prototype.selectPagination = function ({
  fields = '',
  page,
  perPage = 20,
  sort,
}) {
  const fields_ = fields.split(',').map((field) => field.trim())
  const offset = page == null ? null : (page - 1) * perPage
  const limit = page == null ? null : perPage
  const sort_ = sort == null ? null : lodash.snakeCase(sort.replace('-', ''))
  const direction = sort == null ? null : sort[0] === '-' ? 'desc' : 'asc'
  if (fields_.length > 0) {
    this.select(...fields_)
  }
  if (offset != null) {
    this.offset(offset)
  }
  if (limit != null) {
    this.limit(limit)
  }
  if (sort_ != null) {
    const timestampTypes = ['created_at', 'expired_at', 'updated_at']
    if (timestampTypes.indexOf(sort_) > -1) {
      this.orderBy(sort_, direction)
    } else {
      this.orderByRaw(sort_ + ' COLLATE "th_TH" ' + direction)
    }
  }
  return this
}

KnexQueryBuilder.prototype.selectSearch = function (columns, search) {
  if (search && search.trim().length > 0) {
    this.where((builder) => {
      columns.forEach((column, index) => {
        if (index === 0) {
          builder.where(column, 'like', '%' + search + '%')
        } else {
          builder.orWhere(column, 'like', '%' + search + '%')
        }
      })
    })
  }
  return this
}

const DatabaseFactory = () => {
  const self = require('knex')({
    acquireConnectionTimeout: 300000,
    client: 'pg',
    connection: {
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    },
    pool: { min: 2, max: 20 },
  })
  self.queryBuilder = function () {
    return new KnexQueryBuilder(self.client)
  }
  return self
}

module.exports = DatabaseFactory
