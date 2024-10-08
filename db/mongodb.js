const mongoose = require("mongoose");
const connectMongoDatabase = () => {
  mongoose.connect(process.env.DATABASE_URL).then((data) => {
    console.log(`mongod connected with server: ${data.connection.host}`);
  });
};

module.exports = connectMongoDatabase;
