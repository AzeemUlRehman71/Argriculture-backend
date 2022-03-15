const SessionController = require('@Controllers/Session/SessionController');
const jwtMiddleware = require('@Middlewares/JWTMiddlware');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

module.exports = {

    async register(app, prefix){
        console.log('in session routes...', prefix)
        app.post(`${prefix}session/save`, [validate(schemas.saveSession), jwtMiddleware.authenticateJWT], SessionController.save);
        app.post(`${prefix}session/update/:sessionId`, [validate(schemas.updateSession), jwtMiddleware.authenticateJWT], SessionController.update);
        app.post(`${prefix}session/list`, [validate(schemas.saveSession), jwtMiddleware.authenticateJWT], SessionController.list);
    }

}