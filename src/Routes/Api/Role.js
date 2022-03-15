const RoleController = require('@Controllers/Role/RoleController');
const PermissionController = require('@Controllers/Role/PermissionController');
const RolePermissionController = require('@Controllers/Role/RolePermissionController');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

// NOTE: validations to be added
module.exports = {
    async register(app, prefix) {
        app.post(`${prefix}role`, RoleController.addRole);
        app.post(`${prefix}permission`, PermissionController.addPermission);
        app.post(`${prefix}rolePermission`, RolePermissionController.addRolePermission);
    }
}