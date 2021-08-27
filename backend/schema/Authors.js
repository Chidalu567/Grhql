const mongoose = require("mongoose");

//schema or document structure
const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { collection: "Authors" }
);

//create database model
const Authors = mongoose.model("AuthorModel", AuthorSchema);

module.exports = Authors;
