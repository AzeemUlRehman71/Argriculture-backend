const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserRoleSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      required: true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  },
  {
    timestamps: true
  }
)


UserRoleSchema.statics.add =  async function (req) {
  const UserRole = mongoose.model('UserRole', UserRoleSchema);
  const userRole = new UserRole();
  console.log('user role in modal', userRole)
  const { user, role } = req;
  
  userRole.user = user;
  userRole.role = role;
  await userRole.save();
  return userRole;
}

UserRoleSchema.statics.update =  async function (req, id) {
  const UserRole = mongoose.model('UserRole', UserRoleSchema);
  const userRole = await UserRole.findById(id)
  const { name, role } = req;
  
  userRole.user = user;
  userRole.role = role;
  await userRole.save();
  return userRole;
}
UserRoleSchema.statics.list = async function (filter, data) {
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

  const skipRecord = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;
  const stagePaginate = {
    $facet: {
      metadata: [ { $count: "total" } ],
      docs: [ { $skip: skipRecord }, { $limit: nPerPage } ]
    }
  }
  allStages.push(stagePaginate)

  const stageResult = {
    $project: {
      metadata: {$arrayElemAt:["$metadata",0]},
      docs: "$docs"
    }
  }

  allStages.push(stageResult)

  try {

    const userRoleList = await UserRole.aggregate(allStages)
    let {0: obj} = userRoleList,
    {
      docs = [],
      metadata = {}
    } = obj;
    const total = metadata.total || 0;
    let totalPages = 0;
    if(total <= 10 && total > 0){
      totalPages = 1
    }

    if(total > 10){
      totalPages = Math.ceil(total/nPerPage)
    }

    return {
      "userRoles": {
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
UserRoleSchema.plugin(mongoosePaginate)
const UserRole =  mongoose.model('UserRole', UserRoleSchema)
module.exports = UserRole;