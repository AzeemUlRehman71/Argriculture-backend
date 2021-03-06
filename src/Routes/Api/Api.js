const UserController = require('@Controllers/User/UserController');
const jwtMiddleware = require('@Middlewares/JWTMiddlware');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

const authRoute = require('@Routes/Api/Auth');
const childRoute = require('@Routes/Api/Child');
const sessionRoute = require('@Routes/Api/Session');
const roleRoute = require('@Routes/Api/Role');

module.exports = {
    async register(app, prefix) {
        console.log('in api router')
        authRoute.register(app, prefix);
        childRoute.register(app, prefix);
        sessionRoute.register(app, prefix);
        roleRoute.register(app, prefix);
    }
}