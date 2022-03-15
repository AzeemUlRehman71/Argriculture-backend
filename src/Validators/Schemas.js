const Joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;

function mongoId(joi) {
    return {
        name: 'string',
        base: joi.string(),
        language: {
            mongoId: 'must be a valid mongodb object id'
        },
        rules: [{
            name: 'mongoId',
            validate(params, value, state, options) {
                if (ObjectId.isValid(value)) {
                    return value;
                } else {
                    return this.createError('string.mongoId', {value}, state, options);
                }
            }
        }]
    }
}

// const Joi = BaseJoi.extend(mongoId);

const schemas = {
    login: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    }),
    register: Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
    }),
    userList: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email()
    }),
    verifyUser: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    saveChild: Joi.object().keys({
        user: Joi.string().required(),
        name: Joi.string().required(),
        dob: Joi.string().required(),
    }),
    updateChild: Joi.object().keys({
        name: Joi.string().required(),
        dob: Joi.string().required(),
    }),
    listChild: Joi.object().keys({
        user: Joi.string(),
        name: Joi.string(),
        dob: Joi.string(),
    }),
    saveSession: Joi.object().keys({
        user: Joi.string().required(),
        name: Joi.string().required()
    }),
    updateSession: Joi.object().keys({
        name: Joi.string().required()
    }),
    listSession: Joi.object().keys({
        user: Joi.string(),
        name: Joi.string()
    }),
    updateUser: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        role: Joi.string(),
    }),
    // define all the other schemas below
};
module.exports = schemas;