const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
)


RoleSchema.statics.add = async function (req) {
  const Role = mongoose.model('Role', RoleSchema);
  const role = new Role();
  console.log('role in modal', role)
  const { name } = req;

  role.name = name;
  await role.save();
  return role;
}

RoleSchema.statics.update = async function (req, id) {
  const Role = mongoose.model('Role', RoleSchema);
  const role = await Role.findById(id)
  const { name } = req;

  role.name = name;
  await role.save();
  return role;
}
RoleSchema.statics.list = async function (filter, data) {
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

    const roleList = await Role.aggregate(allStages)
    let { 0: obj } = roleList,
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
      "roles": {
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
RoleSchema.plugin(mongoosePaginate)
const Role = mongoose.model('Role', RoleSchema)
module.exports = Role;