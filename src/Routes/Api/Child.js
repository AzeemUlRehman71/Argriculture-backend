const ChildController = require('@Controllers/Child/ChildController');
const jwtMiddleware = require('@Middlewares/JWTMiddlware');
const validate = require('@Middlewares/ValidateMiddleware');
const schemas = require('@Validators/Schemas');

module.exports = {

    async register(app, prefix){
        console.log('in child routes...', prefix)
        app.post(`${prefix}child/save`, [validate(schemas.saveChild), jwtMiddleware.authenticateJWT], ChildController.save);
    }

}