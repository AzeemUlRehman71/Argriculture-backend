module.exports = {
  tableName: "role_permissions",
  created_at: true,
  updated_at: true,
  deleted_at: true,
  attributes: {
    id: {
      type: "number",
      columnType: "integer",
      required: false,
      autoIncrement: true,
    },
    role_id: {
      model: "Roles",
    },
    permission_id: {
      model: "Permission",
    },
  },
};


const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const RolePermissionchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      required: true
    },
    permission:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permissions',
      required: true
    }
  },
  {
    timestamps: true
  }
)


RolePermissionchema.statics.add =  async function (req) {
  const RolePermission = mongoose.model('RolePermission', RolePermissionchema);
  const rolePermission = new RolePermission();
  console.log('role permission in modal', rolePermission)
  const { permission, role } = req;
  
  rolePermission.permission = permission;
  rolePermission.role = role;
  await rolePermission.save();
  return rolePermission;
}

RolePermissionchema.statics.update =  async function (req, id) {
  const RolePermission = mongoose.model('RolePermission', RolePermissionchema);
  const rolePermission = await RolePermission.findById(id)
  const { permission, role } = req;
  
  rolePermission.permission = permission;
  rolePermission.role = role;
  await rolePermission.save();
  return rolePermission;
}
RolePermissionchema.statics.list = async function (filter, data) {
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

    const rolePermissionList = await RolePermission.aggregate(allStages)
    let {0: obj} = rolePermissionList,
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
      "rolePermissions": {
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
RolePermissionchema.plugin(mongoosePaginate)
const RolePermission =  mongoose.model('RolePermission', RolePermissionchema)
module.exports = RolePermission;