const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  // fields
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  age: {
    type: Number,
  },
});

// exporting the schema, can access anywhere using the file name
module.exports = mongoose.model("data", fileSchema);
