/**
 * establish a bunyan logger
 */



const
    bunyan = require('bunyan');

let
    logger;
    const createLogger = options => {
      options = {name: 'coffida', ...options};
      if (logger) return logger;
      logger = bunyan.createLogger(options);
      return logger;
};

module.exports = createLogger;
