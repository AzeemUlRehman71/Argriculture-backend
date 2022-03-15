
const apiRouter = require('@Routes/Api/Api');
const adminRouter = require('@Routes/Admin/Admin');

module.exports = {
    async register(app) {
        try {

            // middleware specific to this router
            app.use(async function timeLog (req, res, next) {
                
                const url = req.url;
                console.log('url...', url)
                const version = 'v1';
                if (url.startsWith('/admin')) {
                    await adminRouter.register(app, `/admin/${version}/`);
                }
    
    
                if (url.startsWith('/api')) {
                    await apiRouter.register(app, `/api/${version}/`);
                };
                next()
            });

        } catch (e) {
            console.log(e);
        }
    }

};
