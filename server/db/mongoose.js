const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ArticlesApp")
  .then(
    () => {
      console.log(`connected to database...`);
    },
    e => {
      console.log("Error", e);
    }
  );

module.exports = mongoose;
