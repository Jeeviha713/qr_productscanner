const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("./models/Product");
const User = require("./models/User");

const app = express();
const PORT = 5000;


mongoose.connect("mongodb://localhost:27017/qr-product")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });




app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ message: "Enter valid email address" });
    }

    if (password.length < 6) {
      return res.json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ message: "Login Success" });
    } else {
      res.json({ message: "Invalid Credentials" });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image, 
      qrCode: "",
      qrValue: ""
    });

    await newProduct.save();

    res.json(newProduct);
  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

  
    if (req.file) {
      const oldImagePath = path.join(__dirname, "uploads", product.image);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      product.image = req.file.filename; 
    }

   
    product.name = name;
    product.price = price;
    product.description = description;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product && product.image) {
      const filePath = path.join(__dirname, "uploads", product.image);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/api/products/:id/generate-qr", async (req, res) => {
  try {
    const { qrCode, qrValue } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { qrCode, qrValue },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error("QR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/api/products/:id/purchase", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === 2) {
      return res.json({ message: "This product is already purchased", product });
    }

    product.status = 2;
    await product.save();

    res.json({ message: "Product purchased successfully", product });
  } catch (err) {
    console.error("PURCHASE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});