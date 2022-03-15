const Joi = require('joi'); 
const Response = require('@Formators/ApiResponseFormator');

const validate = (schema, property) => { 
  return (req, res, next) => { 
    const { error } = schema.validate(req.body); 
    const valid = error == null; 

    if (valid) { 
      next(); 
    } else { 
      const { details } = error; 
      const message = details.map(i => i.message).join(',');

      console.log("error", message); 
      Response.validationErr(res, 1, message, {});
    } 
  } 
} 
module.exports = validate;