const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    api: {
      type: String,
      default: null
    },
    method: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true
  }
)


PermissionSchema.statics.add =  async function (req) {
  const Permission = mongoose.model('Permission', PermissionSchema);
  const permission = new Permission();
  console.log('permission in modal', permission)
  const { name, code, api, method } = req;
  
  permission.name = name;
  permission.code = code;
  permission.api = api;
  permission.method = method;
  await permission.save();
  return permission;
}

PermissionSchema.statics.update =  async function (req, id) {
  const Permission = mongoose.model('Permission', PermissionSchema);
  const permission = await Permission.findById(id)
  const { name, code, api, method } = req;
  
  permission.name = name;
  permission.code = code;
  permission.api = api;
  permission.method = method;
  await permission.save();
  return permission;
}
PermissionSchema.statics.list = async function (filter, data) {
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

    const permissionList = await Permission.aggregate(allStages)
    let {0: obj} = permissionList,
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
      "permissions": {
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
PermissionSchema.plugin(mongoosePaginate)
const Permission =  mongoose.model('Permission', PermissionSchema)
module.exports = Permission;