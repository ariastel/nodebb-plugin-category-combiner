const { winston } = require('./nodebb');


function formatMessage(msg) {
  return `[category-combiner] ${msg}`;
}

module.exports = {
  verbose: (msg) => winston.verbose(formatMessage(msg)),
  error: (msg) => winston.error(formatMessage(msg)),
  warn: (msg) => winston.warn(formatMessage(msg)),
};
