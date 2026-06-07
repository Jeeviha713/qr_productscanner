const Product = require("../models/Product");
const generateQR = require("../utils/generateQR");
const { v4: uuidv4 } = require("uuid");

exports.addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    const uniqueId = uuidv4();

    const qrCode = await generateQR(uniqueId);

    const product = new Product({
      name,
      price,
      qrCode,
      uniqueId,
    });

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};