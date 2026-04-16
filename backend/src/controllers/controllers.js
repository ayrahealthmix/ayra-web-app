import Product from "../models/productSchema.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

// PUBLIC
export const getProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        message: "Database not connected",
      });
    }

    const products = await Product.find();

    res.status(200).json({
      status: "ok",
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    });
  }
  console.log("Cloudinary config:", cloudinary.config());
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundProduct = await Product.findOne({
      productId: String(id),
    });

    if (!foundProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "ok",
      data: foundProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const getSearchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    const products = await Product.find(filter);

    res.status(200).json({
      status: "ok",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADMIN
export const adminLogin = (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.json({
      status: "error",
      message: "Password is required",
    });
  }

  if (password !== process.env.ADMIN_KEY) {
    return res.json({
      status: "error",
      message: "Invalid admin password",
    });
  }

  res.status(200).json({
    status: "ok",
    message: "Admin login successful",
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, variants, category, isAvailable } = req.body;

    if (!req.files?.thumbnail) {
      return res.status(400).json({
        status: "error",
        message: "Thumbnail image is required",
      });
    }

    const thumbUpload = await cloudinary.uploader.upload(
      req.files.thumbnail[0].path,
      { folder: "products/thumbnail" },
    );

    const thumbnail = thumbUpload.secure_url;

    let images = [];

    if (req.files.images) {
      const uploadPromises = req.files.images.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products/images",
        }),
      );

      const uploadedImages = await Promise.all(uploadPromises);
      images = uploadedImages.map((img) => img.secure_url);
    }

    let parsedVariants = [];

    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);

        parsedVariants = parsedVariants.map((v) => ({
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : undefined,
          netWeight: v.netWeight,
        }));
      } catch {
        return res.status(400).json({
          status: "error",
          message: "Invalid variants format",
        });
      }
    }

    if (!parsedVariants.length) {
      return res.status(400).json({
        status: "error",
        message: "At least one variant is required",
      });
    }

    const product = await Product.create({
      name,
      description,
      variants: parsedVariants,
      category,
      thumbnail,
      images,
      isAvailable,
    });

    res.status(201).json({
      status: "ok",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.variants) {
      updateData.variants = JSON.parse(updateData.variants);
    }

    if (req.file) {
      updateData.thumbnail = req.file.id.toString();
    }

    if (req.files?.images) {
      updateData.images = req.files.images.map((file) => file.id.toString());
    }

    if (req.files?.thumbnail?.[0]) {
      updateData.thumbnail = req.files.thumbnail[0].id.toString();
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: req.params.id },
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete thumbnail
    if (product.thumbnail) {
      const publicId = product.thumbnail.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/thumbnail/${publicId}`);
    }

    // delete images
    if (product.images?.length) {
      for (let img of product.images) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/images/${publicId}`);
      }
    }

    await Product.findOneAndDelete({ productId: id });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
