const LineClientFactory = require('./Factory/LineClient')

const line = LineClientFactory(process.env.LINE_CHANNEL_ACCESS_TOKEN)

module.exports = line
