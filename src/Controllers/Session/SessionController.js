const Session = require('@Models/Session');
const Response = require('@Formators/ApiResponseFormator');

function getFilter(data) {
  const filter = {};
  if (data.name) {
    filter.name = data.name;
  }
  
  return filter;
}
module.exports = {

  async save(req, res) {
    try {
      console.log('req.body...', req.body)
      const session = await Session.add(req.body);
      Response.successMsg(res, 8, session);
    } catch (e) {
      Response.serverErr(res, 1, e.message, {});
    }
  },
  async update(req, res) {
    try {
      const {sessionId} = req.params
      console.log('sessionId', sessionId)
      const session = await Session.update(req.body, sessionId);
      Response.successMsg(res, 9, session);
    } catch (e) {
      Response.serverErr(res, 1, e.message, {});
    }
  },
  async list(req, res) {
    try {
      console.log(req.body)
      let { body } = req
      const filter = await getFilter(body)
      const sessionList = await Session.list(filter, body)
      if(sessionList){
        Response.successMsg(res, 10, sessionList);
      }else{
        Response.notFoundErr(res, 3, {});
      }
    } catch (e) {
      console.log(e.message)
      Response.serverErr(res, 1, e.message, {});
    }
  }
};