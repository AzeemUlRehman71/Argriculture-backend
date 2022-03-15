const mongoose = require('mongoose')
// const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const ChildSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      default: null
    },
    phone: {
      type: String
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


ChildSchema.statics.add =  async function (req) {
  const Child = mongoose.model('Child', ChildSchema);
  const child = new Child();
  console.log('child in modal', child)
  const { user, name, dob} = req;
  
  child.user = user;
  child.name = name;
  child.dob = dob;
  await child.save();
  return child;
}

ChildSchema.statics.update =  async function (req, id) {
  const Child = mongoose.model('Child', ChildSchema);
  const child = await Child.findById(id)
  const { name, dob} = req;
  
  child.name = name;
  child.dob = dob;
  await child.save();
  return child;
}
ChildSchema.statics.list = async function (filter, data) {
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
      dob: 1,
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

    const childList = await Child.aggregate(allStages)
    let {0: obj} = childList,
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
ChildSchema.plugin(mongoosePaginate)
const Child =  mongoose.model('Child', ChildSchema)
module.exports = Child;