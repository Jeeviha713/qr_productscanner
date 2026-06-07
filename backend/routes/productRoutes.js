const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");


router.post("/add", async (req, res) => {
  const { name, description, price, image } = req.body;

  const uniqueId = uuidv4();

  const qrCode = await QRCode.toDataURL(uniqueId);

  const product = new Product({
    name,
    description,
    price,
    image,
    qrCode,
    qrValue: uniqueId 
  });

  await product.save();

  res.json(product);
});


router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


router.post("/scan", async (req, res) => {
  const { qrData } = req.body;

  const product = await Product.findOne({ qrValue: qrData });

  if (!product) {
    return res.json({ status: "fake" });
  }

  if (product.status === "used") {
    return res.json({ status: "used", product });
  }

  res.json({ status: "valid", product });
});


router.post("/purchase/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { status: "used" });

  res.json({ message: "Purchased successfully" });
});

module.exports = router;