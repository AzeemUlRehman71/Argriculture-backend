require('dotenv').config();

module.exports = {
  development: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // ost: process.env.DB_HOST,
    connectionUrl: `${process.env.MONGO_URI}`,
    dialect: 'mongodb'
  },

};