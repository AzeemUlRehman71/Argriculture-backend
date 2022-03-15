const jwt = require('jsonwebtoken');
// const Joi = require('@hapi/joi');
const User = require('@Models/User');
const Response = require('@Formators/ApiResponseFormator');
const { checkPassword } = require('@Utils/CheckPassword');
const EmailQue = require('@Jobs/EmailQue');

module.exports = {

    async login(req, res) {
        try {
            const {
                email, password
            } = req.body;
            const device = req.body.device !== 'iphone' ? 'android' : 'iphone';
            let user = await User.findOne({ 'email': email }).select('+password');
            if (user) {
                const isPasswordMatch = await checkPassword(res, password, user)
                if (!isPasswordMatch) {
                    Response.unAuthorizedErr(res, 6, {});
                    // Response.errorWithCode(res, 401, 'Invalid credentials.', {});
                }
                Response.successMsg(res, 1, {
                    user: user,
                    token: await jwt.sign({
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                    }, process.env.JWT_SECRET)

                });
            } else {
                Response.notFoundErr(res, 3, {});
            }
        } catch (e) {
            console.log(e.message)
            Response.serverErr(res, 5, e, {});
        }
    },
    async register(req, res) {
        try {
            const user = await User.register(req.body);
            EmailQue.enqueue(user.email, 'register', {
                name: user.name,
                link: `http://localhost:4000/api/v1/auth/verify/${user._id}`
            });
            Response.successMsg(res, 2, {
                user: user,
                token: await jwt.sign({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    roleId: user.role
                }, process.env.JWT_SECRET)

            })
        } catch (e) {
            Response.serverErr(res, 1, e.message, {});
        }
    },
    async verify(req, res) {
        try {
            console.log('in verify funct', req.params)
            const { userId } = req.params
            console.log('userId', userId)
            const user = await User.findOne({ '_id': userId })
            user.verifiedAt = new Date();
            await user.save();
            res.render("verification_success", { user });
            //Response.successMsg(res, 4, user)
        } catch (e) {
            Response.serverErr(res, 1, e.message, {});
        }
    }
};