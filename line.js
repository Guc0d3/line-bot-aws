const LineClientFactory = require('./factory/LineClientFactory')

const line = LineClientFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

module.exports = line
