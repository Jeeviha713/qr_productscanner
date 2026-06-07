const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  image: String,
  qrCode: String,
  qrValue: String,

  status: {
    type: Number,
    default: 1 
  }
});

module.exports = mongoose.model("Product", productSchema);