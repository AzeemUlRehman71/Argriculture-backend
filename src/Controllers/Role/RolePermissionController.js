const RolePermission = require('@Models/RolePermission');
const Response = require('@Formators/ApiResponseFormator');

module.exports = {
    async addRolePermission(req, res) {
        try {
            const rolerPermission = await RolePermission.add(req.body);
            Response.successMsg(res, 0, rolerPermission);
        } catch (error) {
            console.log(`error occured while adding role permission ${JSON.stringify(error)}`)
            Response.serverErr(res, 1, error.message, {});
        }
    }
};