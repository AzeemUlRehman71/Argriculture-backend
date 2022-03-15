const LoginController = require('@Controllers/Auth/AuthController');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

module.exports =  {
    async register(app, prefix) {
        app.post(`${prefix}auth/login`, validate(schemas.login), LoginController.login);
        app.post(`${prefix}auth/register`, validate(schemas.register), LoginController.register);
        app.get(`${prefix}auth/verify/:userId`, LoginController.verify);
    }
}