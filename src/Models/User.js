const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            // validate: {
            //   validator: validator.isEmail,
            //   message: 'EMAIL_IS_NOT_VALID'
            // },
            lowercase: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        },
        isFreeTrialAvailed: {
            type: Boolean,
            default: false
        },
        freeTrialStartDate: {
            type: Date,
            default: null
        },
        freeTrialEndDate: {
            type: Date,
            default: null
        },
        verifiedAt: {
            type: Date,
            default: null
        },
        phone: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, (error, newHash) => {
        if (error) {
            return next(error)
        }
        user.password = newHash
        return next()
    })
}

const genSalt = (user, SALT_FACTOR, next) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        return hash(user, salt, next)
    })
}

UserSchema.pre('save', function (next) {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('password')) {
        return next()
    }
    return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, user, cb) {
    bcrypt.compare(passwordAttempt, user.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
}
UserSchema.statics.register = async function (req) {
    const User = mongoose.model('User', UserSchema);
    const user = new User();
    const { name, email, password, role } = req

    user.name = name
    user.email = email
    user.password = password
    user.role = role
    await user.save();
    return user;
}
UserSchema.statics.list = async function (filter, data) {
    const { page = 1, nPerPage = 10 } = data;
    let allStages = [];
    const stageMatch = {
        $match: filter
    }

    allStages.push(stageMatch)

    const stageProject = {
        $project: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1

        }
    }

    allStages.push(stageProject)

    const stageSort = {
        $sort: {
            createdAt: -1
        }
    }

    allStages.push(stageSort);

    const skipRecord = page > 0 ? ((page - 1) * nPerPage) : 0;
    const stagePaginate = {
        $facet: {
            metadata: [{ $count: "total" }],
            docs: [{ $skip: skipRecord }, { $limit: nPerPage }]
        }
    }
    allStages.push(stagePaginate)

    const stageResult = {
        $project: {
            metadata: { $arrayElemAt: ["$metadata", 0] },
            docs: "$docs"
        }
    }

    allStages.push(stageResult)

    try {

        const userList = await User.aggregate(allStages)
        let { 0: obj } = userList,
            {
                docs = [],
                metadata = {}
            } = obj;
        const total = metadata.total || 0;
        let totalPages = 0;
        if (total <= 10 && total > 0) {
            totalPages = 1
        }

        if (total > 10) {
            totalPages = Math.ceil(total / nPerPage)
        }

        return {
            "children": {
                "docs": docs,
                "totalDocs": total,
                "nPerPage": nPerPage,
                "totalPages": totalPages,
                "page": page
            }
        }

    } catch (e) {
        console.log(e);
    }
};
UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)
module.exports = User