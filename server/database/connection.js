require('dotenv').config()
const mongoose = require('mongoose');

let options = {};
if (
  process.env.MONGOD_USERNAME &&
  process.env.MONGOD_PASSWORD &&
  process.env.MONGOD_AUTH_SOURCE
) {
  options = {
    useNewUrlParser: true,
    authSource: process.env.MONGOD_AUTH_SOURCE || "admin",
    auth: {
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
    },
  };
};

const mongodb =
  `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT
  }/${process.env.MONGODB_NAME}`;

class Mongoose {
  connect() {
    mongoose.connect(mongodb, options);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', function (err) {
      console.log(err);
      process.exit(1);
    });
    mongoose.set('debug', false);
  }

  async collectionLists (mongoose) {
    const connection = mongoose.connection;
      
    const mongoCollections = new Promise((resolve, reject) => {
        connection.on('error', err => reject(err))
        connection.once('open', () => resolve(
          connection.db.listCollections().toArray())
        );
    })

    return mongoCollections
  }
}

module.exports = new Mongoose
