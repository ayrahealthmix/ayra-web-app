const router = require("express").Router();
const controller = require("../controllers/controllers");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload.middleware");

// ADMIN
router.post("/admin/login", controller.adminLogin);
router.post(
  "/admin/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  controller.createProduct,
);
// router.put("/products/:id", adminAuth, upload, controller.updateProduct);
router.delete("/products/:id", adminAuth, controller.deleteProduct);
router.patch(
  "/products/:id/available",
  adminAuth,
  controller.updateAvailability,
);

// PUBLIC
router.get("/products", controller.getProducts);
router.get("/products/search", controller.getSearchProducts); // Must come before /products/:id
router.get("/product/:id", controller.getProductById);
router.get("/images/:id", controller.getImage); // Route to serve images from GridFS

module.exports = router;
