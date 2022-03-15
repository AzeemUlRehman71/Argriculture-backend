const userRoute = require('@Routes/Admin/User')
const childRoute = require('@Routes/Admin/Child')
const sessionRoute = require('@Routes/Admin/Session')

module.exports = {
    async register(app, prefix) {
        userRoute.register(app, prefix);
        childRoute.register(app, prefix);
        sessionRoute.register(app, prefix);
    }
}