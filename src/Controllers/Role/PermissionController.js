const Permission = require('@Models/Permission');
const Response = require('@Formators/ApiResponseFormator');

module.exports = {
    async addPermission(req, res) {
        try {
            const permission = await Permission.add(req.body);
            Response.successMsg(res, 0, permission);
        } catch (error) {
            console.log(`error occured while adding permission ${JSON.stringify(error)}`)
            Response.serverErr(res, 1, error.message, {});
        }
    }
};