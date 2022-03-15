const Child = require('@Models/Child');
const Response = require('@Formators/ApiResponseFormator');

function getFilter(data) {
    const filter = {};
    if (data.name) {
        filter.name = data.name;
    }
    if (data.dob) {
        filter.dob = data.dob;
    }

    return filter;
}

module.exports = {

    async save(req, res) {
        try {
            console.log('req.body...', req.body)
            const child = await Child.add(req.body);
            Response.successMsg(res, 5, child);
        } catch (e) {
            Response.serverErr(res, 1, e.message, {});
        }
    },
    async update(req, res) {
        try {
            const {childId} = req.params
            console.log('childId', childId)
            const child = await Child.update(req.body, childId);
            Response.successMsg(res, 6, child);
        } catch (e) {
            Response.serverErr(res, 1, e.message, {});
        }
    },
    async list(req, res) {
        try {
            console.log(req.body)
            let {body} = req
            const filter = await getFilter(body)
            const childList = await Child.list(filter, body)
            if (childList) {

                Response.successMsg(res, 7, childList);
            } else {
                Response.notFoundErr(res, 9, {});
            }
        } catch (e) {
            console.log(e.message)
            Response.serverErr(res, 1, e.message, {});
        }
    }
};