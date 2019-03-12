const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const BookSchema = new Schema({
  title: String,
  authors: String,
  rating: Number,
  publisher: String,
  publishedDate: String,
  description: String,
  thumbnail: String,
  price: Number,
  purchase: String
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Books", BookSchema);