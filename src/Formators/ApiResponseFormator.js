
const errorList = require('@Shared/error');
const successList = require('@Shared/success');

module.exports = {
  successMsg(res, successCode = 1, data = {}) {
    let msg = successList.messageByCode(successCode);
    msg = msg.length ? msg : '';
    res.status(200).json({'status': true, 'message': msg, 'data': data}).send();
  },
  unAuthorizedErr(res, errCode = 1, errMsg = '', data = {}) {
    let msg = errorList.messageByCode(errCode)
    msg = msg.length ? msg : errMsg
    res.status(401).json({'status': false, 'message': msg, 'data': data}).send();
  },
  forbiddenErr(res, errCode = 1, errMsg = '', data = {}) {
    let msg = errorList.messageByCode(errCode)
    msg = msg.length ? msg : errMsg
    res.status(401).json({'status': false, 'message': msg, 'data': data}).send();
  },
  validationErr(res, errCode = 1, errMsg = '', data = {}) {
    res.status(400).json({'status': false, 'message': errMsg, 'data': data}).send();
  },
  serverErr(res, errCode = 1, errMsg = '', data = {}) {
    if(!errMsg.length){
      let msg = errorList.messageByCode(errCode)
      errMsg = msg.length ? msg : errMsg
    }
    res.status(500).json({'status': false, 'message': errMsg, 'data': data}).send();
  },
  notFoundErr(res, errCode = 1, errMsg = '', data = {}) {
    if(!errMsg.length){
      let msg = errorList.messageByCode(errCode)
      errMsg = msg.length ? msg : errMsg
    }
    res.status(404).json({'status': false, 'message': errMsg, 'data': data}).send();
  }
};
