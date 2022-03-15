const Permission = require('@Models/Permission');
const Response = require('@Formators/ApiResponseFormator');
const RolePermission = require('@Models/RolePermission');

exports.roleAllowed = async (req, res, next) => {
    const permission = await Permission.findOne({ api: req.path, method: req.method });
    const rolePermission = await RolePermission.findOne({ role: req.user.roleId, permission: permission._id })
    if (rolePermission) next();
    else {
        Response.unAuthorizedErr(res, 7, {})
    }
}
