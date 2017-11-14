const forIn = require('lodash').forIn;

exports.sentToAll = (entries, callback) => {
  forIn(entries, entry => {
    callback(entry);
  });
};

exports.sendIfIdsNotEquals = (entries, leftId = null, rightId, callback) => {
  forIn(entries, (entry, key) => {
    if (leftId || +key !== rightId) {
      callback(entry);
    }
  });
};