import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Details.scss";
import { getProductById } from "../../services/api";
import { BASE_URL } from "../../helpers/config";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const productName = "Masala Powder";
  // const message = encodeURIComponent(
  //   `Hello, I want to buy ${productName}. Please share price and details.`,
  // );

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data.data));
  }, [id]);

  if (!product) return <p>Product not found</p>;

  return (
    <section className="detail">
      {/* Image */}
      <div className="detail-image">
        <img src={`${BASE_URL}${product.thumbnail}`} alt={product.name} />
      </div>

      {/* Info */}
      <div className="detail-info">
        <h1>{product.name}</h1>
        <p className="desc">{product.description}</p>
        <table className="variants">
          <thead>
            <th>Weight</th>
            <th>Price</th>
          </thead>
          <tbody>
            {product.variants.map((variant) => (
              <tr key={variant.id}>
                <td>{variant.netWeight}</td>
                <td>₹{variant.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <button className="add">Email</button>
          <button className="buy">Whatsapp</button>
          <button className="buy">Phone</button>
        </div>
      </div>
    </section>
  );
}
