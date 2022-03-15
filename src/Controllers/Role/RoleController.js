const Role = require('@Models/Role');
const Response = require('@Formators/ApiResponseFormator');

module.exports = {
    async addRole(req, res) {
        try {
            const role = await Role.add(req.body);
            Response.successMsg(res, 0, role);
        } catch (error) {
            console.log(`error occured while adding role ${JSON.stringify(error)}`)
            Response.serverErr(res, 1, error.message, {});
        }
    }
};