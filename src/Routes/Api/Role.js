const RoleController = require('@Controllers/Role/RoleController');
const PermissionController = require('@Controllers/Role/PermissionController');
const RolePermissionController = require('@Controllers/Role/RolePermissionController');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');
const roleAllowed = require('@Middlewares/RoleAllowed');
const jwtMiddleware = require('@Middlewares/JWTMiddlware');

// NOTE: validations to be added

/**  [NOTE]: remove [jwtMiddleware.authenticateJWT, roleAllowed.roleAllowed] and create super admin and admin roles
 * create user against each role, allow role permission for addRole to super admin only
 * apply these policies, api will return 401 for admin role and work for super admin
 * */
module.exports = {
    async register(app, prefix) {
        app.post(`${prefix}role`, [jwtMiddleware.authenticateJWT, roleAllowed.roleAllowed], RoleController.addRole);
        app.post(`${prefix}permission`, PermissionController.addPermission);
        app.post(`${prefix}rolePermission`, RolePermissionController.addRolePermission);
    }
}