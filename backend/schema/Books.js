const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authors",
      required: true,
    },
  },
  { collection: "Books" }
);

const Books = mongoose.model("BookModel", BookSchema);

module.exports = Books;
