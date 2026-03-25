import { useState, useEffect } from "react";
import "./ProductForm.scss";
import { createProductApi, updateProductApi } from "../../../services/api"; // Import update API

const initialState = {
  productId: "",
  name: "",
  description: "",
  category: "",
  isAvailable: true,
};

export default function ProductForm(props) {
  const { setIsAlertOpen, editingProduct, setEditingProduct, setProducts } =
    props; // Destructure new props
  // ===== FORM STATE =====
  const [form, setForm] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [existingImages, setExistingImages] = useState([]); // Store existing images for display

  // ✅ VARIANTS STATE
  const [variants, setVariants] = useState([
    { price: "", discountPrice: "", netWeight: "" },
  ]);

  const MAX_IMAGES = 5;

  // ===== POPULATE FORM ON EDIT =====
  useEffect(() => {
    if (editingProduct) {
      setForm({
        productId: editingProduct.productId,
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        isAvailable: editingProduct.isAvailable,
      });
      setVariants(editingProduct.variants || []);
      setExistingImages(editingProduct.images || []); // Show existing images
      // Note: We can't set 'thumbnail' file object from URL, so user has to re-upload if they want to change it.
      // We could show a preview of existing thumbnail though.
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  const resetForm = () => {
    setForm(initialState);
    setVariants([{ price: "", discountPrice: "", netWeight: "" }]);
    setThumbnail(null);
    setImages([]);
    setExistingImages([]);
    if (setEditingProduct) setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ===== VARIANTS HANDLERS =====

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { price: "", discountPrice: "", netWeight: "" }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ===== IMAGE HANDLERS =====

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024,
    );

    setImages((prev) => {
      const merged = [...prev, ...validFiles];
      return merged.slice(0, MAX_IMAGES);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== SUBMIT =====

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check thumbnail only if creating new product OR if updating and user uploaded a NEW one.
    // However, backend keeps old one if not provided.
    if (!editingProduct && !thumbnail) {
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: "Thumbnail is required",
      });
      return;
    }

    // Basic validation
    const invalid = variants.some((v) => !v.price || !v.netWeight);

    if (invalid) {
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: "Price and NetWeight are required for all variants",
      });
      return;
    }

    const formData = new FormData();

    // Only append productId if creating (optional if backend generates it, but looks like you have it in schema)
    // Actually schema says it's generated? "productSchema.pre('save'...)"
    // But you have it in initialState.
    // For update, we use ID from editingProduct.
    if (!editingProduct) {
      // If backend generates it, we might not need to send it?
      // But let's send whatever comes from form if user manually enters it (if input exists).
      // Looking at Code: initialState has productId, but JSX doesn't have input for it.
      // So it's likely unused or auto-generated.
    }

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("isAvailable", form.isAvailable);

    // ✅ MAIN PART – SEND VARIANTS
    formData.append("variants", JSON.stringify(variants));

    // files
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (images.length > 0) {
      images.forEach((img) => formData.append("images", img));
    }

    try {
      let res;
      if (editingProduct) {
        res = await updateProductApi(editingProduct.productId, formData);
        // Update product in list locally
        if (setProducts) {
          setProducts((prev) =>
            prev.map((p) =>
              p.productId === editingProduct.productId ? res.data.data : p,
            ),
          ); // Assuming res.data.data is the updated product
        }
      } else {
        res = await createProductApi(formData);
        if (setProducts) {
          // Ideally fetch all again or append.
          // For now let's just alert.
          // Or better, fetch all products again to be safe?
          // Or append if we have the full object.
        }
      }

      setIsAlertOpen({
        open: true,
        title: "Success!",
        message:
          res.data.message ||
          (editingProduct ? "Product updated" : "Product created"),
      });

      resetForm();
    } catch (err) {
      console.error(err);
      setIsAlertOpen({
        open: true,
        title: "Oops!",
        message: err?.response?.data?.message || "Operation failed",
      });
    }
  };

  return (
    <form className="product-form-cntnr" onSubmit={handleSubmit}>
      {editingProduct && (
        <div style={{ marginBottom: "1rem", color: "blue" }}>
          Currently Editing: <strong>{editingProduct.name}</strong>
          <button
            type="button"
            onClick={resetForm}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Cancel Edit
          </button>
        </div>
      )}

      <div className="product-form-input product-form-name">
        <label>Product Name</label>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="product-form-input product-form-description">
        <label>Product Description</label>
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="product-form-input product-form-category">
        <label>Category</label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="masala">Masala</option>
          <option value="mix">Mix</option>
          <option value="malt">Malt</option>
        </select>
      </div>
      {/* ===== VARIANTS UI ===== */}
      <div className="variant-box">
        {variants.map((variant, index) => (
          <div key={index} className="product-form-variants">
            <label>Variant {index + 1}</label>
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Discount Price"
              value={variant.discountPrice}
              onChange={(e) =>
                handleVariantChange(index, "discountPrice", e.target.value)
              }
            />

            <input
              placeholder="Net Weight (e.g 100g)"
              value={variant.netWeight}
              onChange={(e) =>
                handleVariantChange(index, "netWeight", e.target.value)
              }
              required
            />

            {variants.length > 1 && (
              <button
                className="product-form-btn"
                type="button"
                onClick={() => removeVariant(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button className="product-form-btn" type="button" onClick={addVariant}>
          + Add Variant
        </button>
      </div>
      {/* ===== FILES ===== */}
      <div className="product-form-input product-form-thumbnail">
        <label>
          Thumbnail {editingProduct && "(Leave empty to keep existing)"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          required={!editingProduct} // Required only if not editing
        />
      </div>
      <div className="product-form-input product-form-images">
        <label>
          Images (Max 5) {editingProduct && "(New uploads will be added)"}
        </label>
        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="preview-cntnr">
          {images.map((img, i) => (
            <div key={i} className="preview-item">
              <img src={URL.createObjectURL(img)} width="70" alt="" />
              <button type="button" onClick={() => removeImage(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="product-form-check-box product-form-is-available">
        <label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>
      </div>
      <button className="product-form-submit-btn" type="submit">
        {editingProduct ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
}
