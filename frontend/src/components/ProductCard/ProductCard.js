import "./ProductCard.scss";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card" key={product.productId} data-aos="zoom-in-down">
      <div className="card-thumbnail">
        <img src={product.thumbnail} alt={product.name} />
      </div>
      <div className="card-details">
        <strong>{product.name}</strong>
        <div className="card-footer">
          <p>
            Starting at{" "}
            <span>
              ₹{" "}
              {product.variants[0]?.discountPrice || product?.variants[0].price}
            </span>
          </p>
          <Link to={`/details/${product.productId}`}>
            <button>Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
