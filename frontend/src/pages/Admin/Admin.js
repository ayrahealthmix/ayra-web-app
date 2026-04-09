import React, { useEffect, useState } from "react";
import "./Admin.scss";
import ProductForm from "./ProductForm/ProductForm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Login from "../../components/Login/Login";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import { useNavigate } from "react-router-dom";
import AlertPopup from "../../components/AlertPopup/AlertPopup";
import { deleteProductApi, getProductsApi } from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useIsMobile } from "../../hooks/useIsMobile";
const Admin = () => {
  const [products, setProducts] = useState([]);
  const [isFormExpanded, setIsFormExpanded] = React.useState(["add", "all"]);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState({
    open: false,
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      navigate("/");
      return;
    }

    const adminPassword = localStorage.getItem("adminPassword");
    if (!adminPassword) {
      setIsLoginOpen(true);
    }

    getProductsApi({
      category: "",
      minPrice: null,
    })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const [editingProduct, setEditingProduct] = useState(null);

  const toggleExpansion = (value) => {
    if (isFormExpanded.includes(value)) {
      setIsFormExpanded((prev) => prev.filter((v) => v !== value));
    } else {
      setIsFormExpanded((prev) => [...prev, value]);
    }
  };

  const handleAdminLouOut = () => {
    localStorage.removeItem("adminPassword");
    navigate("/");
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find((p) => p.productId === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      if (!isFormExpanded.includes("add")) {
        setIsFormExpanded((prev) => [...prev, "add"]);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeleteProduct = (id) => {
    deleteProductApi(id)
      .then((res) => {
        setProducts((prev) => prev.filter((p) => p.productId !== id));
        setIsAlertOpen({
          open: true,
          title: "Success",
          message: "Product deleted successfully",
        });
      })
      .catch((err) => {
        setIsAlertOpen({
          open: true,
          title: "Error",
          message: "Failed to delete product",
        });
      });
  };

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin-cntnr">
        <div className="admin-header" onClick={() => toggleExpansion("add")}>
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          {isFormExpanded.includes("add") ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </div>
        {isFormExpanded.includes("add") && (
          <ProductForm
            setIsAlertOpen={setIsAlertOpen}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            setProducts={setProducts} // Pass setProducts to update list after edit
          />
        )}
      </div>
      <div className="admin-cntnr">
        <div className="admin-header" onClick={() => toggleExpansion("all")}>
          <h2>All Products</h2>
          {isFormExpanded.includes("all") ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </div>
        {isFormExpanded.includes("all") && (
          <div className="prod-cntnr">
            {products.map((product) => (
              <ProductCard
                product={product}
                page="admin"
                handleDeleteProduct={handleDeleteProduct}
                handleEditProduct={handleEditProduct}
              />
            ))}
          </div>
        )}
      </div>
      <div className="admin-action">
        <button className="logout-btn" onClick={() => handleAdminLouOut()}>
          Logout
        </button>
      </div>
      <ModalPopup
        open={isLoginOpen}
        handleClose={() => navigate("/")}
        title="Admin Login"
        children={<Login onSuccess={() => setIsLoginOpen(false)} />}
      />
      <AlertPopup
        open={isAlertOpen.open}
        title={isAlertOpen.title}
        message={isAlertOpen.message}
        handleClose={() =>
          setIsAlertOpen({ open: false, title: "", message: "" })
        }
      />
    </div>
  );
};

export default Admin;
