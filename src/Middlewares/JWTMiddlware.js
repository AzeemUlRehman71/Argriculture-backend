const jwt = require('jsonwebtoken');
const User = require('@Models/User');
const Response = require('@Formators/ApiResponseFormator');

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // return res.sendStatus(403);
                Response.forbiddenErr(res, 8 , {})
            }

            req.user = user;
            next();
        });
    } else {
        // res.sendStatus(401);
        Response.unAuthorizedErr(res, 7 , {})
    }
    
}
