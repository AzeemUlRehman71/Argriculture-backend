const UserController = require('@Controllers/User/UserController');
const jwtMiddleware = require('@Middlewares/JWTMiddlware');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

module.exports = {

    async register(app, prefix) {
        app.get(`${prefix}users`, [jwtMiddleware.authenticateJWT], UserController.list);
        app.get(`${prefix}users/single/:_id`, [jwtMiddleware.authenticateJWT], UserController.getUser);
        app.put(`${prefix}users/update/:_id`, [validate(schemas.updateUser), jwtMiddleware.authenticateJWT], UserController.updateUser);
        app.delete(`${prefix}users/delete/:_id`, [jwtMiddleware.authenticateJWT], UserController.deleteUser);
    }
}