const MSG_TYPES = require('../constants/messageTypes');
function log(msgType, message, isSend, toWhom){
if (msgType===MSG_TYPES.NPC_MOVE||msgType===MSG_TYPES.HUMAN_UPDATE||msgType===MSG_TYPES.HUMAN_MOVE||msgType===MSG_TYPES.PING) return;
  for (let k in MSG_TYPES) {
    if (MSG_TYPES[k] === msgType) {
      msgType = k;
      break;
    }
  }

  let reqs = isSend?'Response':'Request';
  let date = new Date();
  console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+' '+reqs+':'+toWhom+' '+msgType+':'+message);
}
module.exports = log;