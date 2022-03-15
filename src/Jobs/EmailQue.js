const Queue = require('bee-queue');
const Email = require('@Config/email');

const queue = new Queue('emails', {
  prefix: 'bq',
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 1000,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: 0,
    options: {}
  },
  isWorker: true,
  getEvents: true,
  sendEvents: true,
  storeJobs: true,
  ensureScripts: true,
  activateDelayedJobs: false,
  removeOnSuccess: true,
  removeOnFailure: false,
  redisScanCount: 100
});
function onListen() {
  queue.on('ready', () => {
  });
  queue.on('error', (err) => {
  });
  queue.on('succeeded', (job, result) => {
  });
  queue.on('failed', (job, err) => {
  });
  queue.on('job succeeded', (jobId, result) => {
  });
  queue.on('job retrying', (jobId, err) => {
  });
  queue.on('job failed', (jobId, err) => {
    console.log(err);
  });
  queue.on('job progress', (jobId, progress) => {
  });
}


module.exports = {
  queue,
  async enqueue(to, template ,locals = {}) {

    const job = queue.createJob({ to,template,locals  })
    job.retries(1).save();
    console.log('job queued....')
    return job;

   // console.log('job enqueue')
    //   const emailOTP = require('@Models/emailOTP');
    //   const emailotp = await emailOTP.findOne({_id:emailotpId});

    // //console.log(`pin  send pin(${pin}) to phone(${emailotp.phone})`);
  },
  async start_processing() {
    onListen();
    queue.process(async (job) => {
      console.log('job about to process....', job.id)
      try {
        const res = await Email.send({
          template: job.data.template,
          message: {
            to: job.data.to

          },
          locals: job.data.locals
        });
     //   console.log(res);
      } catch (e) {
        console.log(e);
      }
      // eslint-disable-next-line max-len


      job.reportProgress(100);
      console.log('job done.....')
      return 'done';
    });
  }
};
