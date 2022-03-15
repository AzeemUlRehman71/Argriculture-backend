require('module-alias/register');
require('dotenv').config();
const EmailQue = require('@Jobs/EmailQue');
EmailQue.start_processing();