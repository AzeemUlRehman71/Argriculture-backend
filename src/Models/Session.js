const mongoose = require('mongoose')
// const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const SessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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


SessionSchema.statics.add =  async function (req) {
  const Session = mongoose.model('Session', SessionSchema);
  const session = new Session();
  console.log('session in modal', session)
  const { user, name, dob} = req;
  
  session.user = user;
  session.name = name;
  await session.save();
  return session;
}

SessionSchema.statics.update =  async function (req, id) {
  const Session = mongoose.model('Session', SessionSchema);
  const session = await Session.findById(id)
  const { name} = req;
  
  session.name = name;
  await session.save();
  return session;
}
SessionSchema.statics.list = async function (filter, data) {
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

    const sessionList = await Session.aggregate(allStages)
    let {0: obj} = sessionList,
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
      "sessions": {
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
SessionSchema.plugin(mongoosePaginate)
const Session =  mongoose.model('Session', SessionSchema)
module.exports = Session;