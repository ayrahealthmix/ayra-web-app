import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

import {
  adminLogin,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAvailability,
  getProducts,
  getProductById,
  getSearchProducts,
} from "../controllers/controllers.js";

const router = express.Router();

// ADMIN
router.post("/admin/login", adminLogin);

router.post(
  "/admin/products",
  adminAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct,
);

router.put(
  "/admin/products/:id",
  adminAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct,
);

router.delete("/admin/products/:id", adminAuth, deleteProduct);

router.patch("/admin/products/:id/available", adminAuth, updateAvailability);

// PUBLIC
router.get("/products", getProducts);
router.get("/products/search", getSearchProducts);
router.get("/product/:id", getProductById);

export default router;
