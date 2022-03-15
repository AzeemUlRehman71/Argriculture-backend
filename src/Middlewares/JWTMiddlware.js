const jwt = require('jsonwebtoken');
const User = require('@Models/User');
const Response = require('@Formators/ApiResponseFormator');

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                Response.forbiddenErr(res, 8, {})
            }
            req.user = user;
            next();
        });
    } else {
        Response.unAuthorizedErr(res, 7, {})
    }
}
