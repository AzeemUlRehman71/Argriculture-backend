const User = require('@Models/User');
const Response = require('@Formators/ApiResponseFormator');

function getFilter(data) {
    const filter = {};
    if (data.name) {
        filter.name = data.name;
    }
    if (data.email) {
        filter.email = data.email;
    }

    return filter;
}

module.exports = {

    async list(req, res) {
        try {

            // var getAllUserspromise =User.find();
            // getAllUserspromise
            //     .then(users => {
            //         if (users) {
            //             Response.successMsg(res, 3, users);
            //         } else {
            //             Response.notFoundErr(res, 3, {});
            //         }
            //     })
            //     .catch(err => {
            //         console.log(err.message)
            //         Response.serverErr(res, 1, err.message, {});
            //     });
            // console.log(req.body)
            let {body} = req
            const filter = await getFilter(body)
            const userList = await User.find();
            if (userList) {
                Response.successMsg(res, 3, userList);
            } else {
                Response.notFoundErr(res, 3, {});
            }
        } catch (e) {
            console.log(e.message)
            Response.serverErr(res, 1, e.message, {});
        }
    },
    getUser(req, res) {
        try {
            const {_id} = req.params;
            var getUserpromise = User.findOne({_id}).exec();
            getUserpromise
                .then(user => {
                    if (user) {
                        Response.successMsg(res, 3, user);
                    } else {
                        Response.notFoundErr(res, 3, {});
                    }
                })
                .catch(err => {
                    console.log(e.message)
                    Response.serverErr(res, 1, e.message, {});
                });
        } catch (err) {
            console.log(e.message)
            Response.serverErr(res, 1, e.message, {});
        }
    },
    async updateUser(req, res) {
        const {_id} = req.params;
        const {name, email, role} = req.body;
        return !email
            ? Response.validationErr(res, 3, 'User content can not be empty', {})
            : User.findOneAndUpdate(
                {_id},
                {$set: {name, email, role}},
                {new: true},
            ).exec().then(user => {
                if (user) {

                    Response.successMsg(res, 3, user);
                } else {
                    Response.notFoundErr(res, 3, {});
                }
            }).catch(e => {
                console.log(e.message)
                Response.serverErr(res, 1, e.message, {});
            });
    },
    async deleteUser(req, res) {
        const {_id} = req.params;
        var deleteUserpromise = User.deleteOne({_id}).exec();
        deleteUserpromise
            .then(() => {
                return new Promise((resolve, reject) => {
                    resolve(User.find({_id: _id}).remove());
                    Response.successMsg(res, 11, {});
                });
            })
            .catch(err => {
                console.log(err.message)
                Response.serverErr(res, 1, err.message, {});
            });
    }
};