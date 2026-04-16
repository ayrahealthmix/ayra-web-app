import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Details.scss";
import { getProductById } from "../../services/api";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  EMAIL_ADDRESS,
} from "../../helpers/config";
import { useIsMobile } from "../../hooks/useIsMobile";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FassiImage from "../../assets/images/Fssai.png";
import ImageSwiper from "../../components/ImageSwiper/ImageSwiper";
import Loader from "../../components/Loader/Loader";

export default function ProductDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const message = `Hi, I want to order:\nProduct: ${product?.name}\nID: ${product?.productId}`;
  const callUrl = `tel:${PHONE_NUMBER}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const emailUrl = isMobile
    ? `mailto:${EMAIL_ADDRESS}?subject=Order Inquiry&body=${encodeURIComponent(message)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=Order Inquiry&body=${encodeURIComponent(message)}`;

  useEffect(() => {
    setIsLoading(true);
    getProductById(id)
      .then((res) => setProduct(res.data.data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!product) return <p>Product not found</p>;
  const images = [product?.thumbnail, ...product?.images, FassiImage];

  return (
    <section className="product-detail-main">
      {/* Image */}
      <div className="product-detail-main__lhs">
        <div className="swiper-cntnr">
          <ImageSwiper images={images} onclick={false} />
        </div>
      </div>

      {/* Info */}
      <div className="product-detail-main__rhs">
        <strong className="name">{product.name}</strong>
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
        <div className="contact-box">
          <h4>Order Now</h4>
          <p>Contact us to place your order</p>
          <div className="contact-btns">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a href={callUrl} target="_blank" rel="noreferrer">
              <PhoneIcon />
              Call
            </a>
            <a href={emailUrl} target="_blank" rel="noreferrer">
              <EmailOutlinedIcon />
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
