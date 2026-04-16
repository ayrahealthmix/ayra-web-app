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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FassiImage from "../../assets/images/Fssai.png";

export default function ProductDetail() {
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
    getProductById(id).then((res) => setProduct(res.data.data));
  }, [id]);

  const images = [product?.thumbnail, FassiImage];

  if (!product) return <p>Product not found</p>;

  return (
    <section className="product-detail-main">
      {/* Image */}
      <div className="product-detail-main__lhs">
        {/* <img src={product.thumbnail} alt={product.name} /> */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-card">
                <img src={img} alt={`product-${index}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
