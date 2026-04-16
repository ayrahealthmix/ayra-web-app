import "./ProductCard.scss";
import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  page,
  handleDeleteProduct,
  handleEditProduct,
}) {
  return (
    <div
      className="card"
      key={product?.productId}
      data-aos={page === "admin" ? "" : "zoom-in-down"}
    >
      <div className="card-thumbnail">
        <img src={product?.thumbnail} alt={product?.name} />
      </div>
      <div className="card-details">
        <strong>{product?.name}</strong>
        <div className="card-footer">
          <p>
            Starting at{" "}
            <span>
              ₹{" "}
              {product?.variants[0]?.discountPrice ||
                product?.variants[0]?.price}
            </span>
          </p>
          <Link to={`/details/${product?.productId}`}>
            <button>Details</button>
          </Link>
          {page === "admin" && (
            <>
              <button
                className="edit-btn"
                onClick={() => handleEditProduct(product?.productId)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteProduct(product?.productId)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
