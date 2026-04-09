import axios from "axios";
import { API_URL } from "../helpers/config";

/* =======================
   ADMIN
======================= */

// Admin login
export const handleAdminLoginApi = (password) => {
  return axios.post(`${API_URL}/admin/login`, {
    password,
  });
};

/* =======================
   PRODUCTS
======================= */

// Search products
export const searchProductApi = (query) => {
  return axios.get(`${API_URL}/products/search`, {
    params: { query },
  });
};

// Get all products with filters

export const createProductApi = (formData) => {
  return axios.post(`${API_URL}/admin/products`, formData, {
    headers: {
      "x-admin": localStorage.getItem("adminPassword"),
    },
  });
};

// Update product
export const updateProductApi = (id, formData) => {
  return axios.put(`${API_URL}/admin/products/${id}`, formData, {
    headers: {
      "x-admin": localStorage.getItem("adminPassword"),
    },
  });
};

// Delete product
export const deleteProductApi = (id) => {
  return axios.delete(`${API_URL}/admin/products/${id}`, {
    headers: {
      "x-admin": localStorage.getItem("adminPassword"),
    },
  });
};

export const getProductsApi = () => {
  return axios.get(`${API_URL}/products`);
};

// Get product by ID
export const getProductById = (id) => {
  return axios.get(`${API_URL}/product/${id}`);
};

// Image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_URL}${imagePath}`;
};
