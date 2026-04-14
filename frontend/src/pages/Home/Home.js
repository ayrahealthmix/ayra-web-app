import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import jsonData from "../../services/data.json";
import SwiperImage1 from "../../assets/banners/masala-banner.png";
import SwiperImage2 from "../../assets/banners/malt-banner.png";
import SwiperImage3 from "../../assets/banners/mixes-banner.png";
import CategoryMasalaImg from "../../assets/images/cat-masala.png";
import CategoryHealthMixImg from "../../assets/images/cat-mix.png";
import CategoryFlourImg from "../../assets/images/cat-malt.png";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function Home() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { categoryHighlights } = jsonData;
  const categoryImages = {
    masala: CategoryMasalaImg,
    "health-mix": CategoryHealthMixImg,
    flour: CategoryFlourImg,
  };

  return (
    <section className="home">
      <div className="swiper-cntnr" data-aos="zoom-in">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          onClick={() => navigate("/list/all")}
        >
          <SwiperSlide>
            <img src={SwiperImage1} alt="slide1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SwiperImage2} alt="slide2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SwiperImage3} alt="slide3" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="category-highlts-main" data-aos="fade-down">
        <h1>Category highlights</h1>
        <p>
          Enhance your taste with our authentic collection—tradition meets
          flavor
        </p>
        <div className="category-highlts-main__row">
          {categoryHighlights.map((category) => (
            <Link
              className="category-highlts-main__row__col"
              key={category.id}
              to={`/list/${category.slug}`}
            >
              <img src={categoryImages[category.slug]} alt="category" />
              <h4>{category.title}</h4>
              {!isMobile && <p>{category.description}</p>}
            </Link>
          ))}
        </div>
      </div>
      <div className="about-us-main" data-aos="fade-up">
        <div className="about-us-main__cntnr">
          <h1>About Us</h1>
          <p>
            We are a food masala company committed to delivering authentic taste
            with uncompromised quality. Every blend is carefully crafted using
            selected spices to ensure rich flavor, freshness, and consistency in
            every meal.
          </p>

          <p>
            Our journey is built on a simple belief — kindness and trust create
            lasting relationships. From sourcing ingredients to reaching your
            kitchen, we focus on honesty, hygiene, and care at every step.
          </p>

          <p>
            We aim to bring families together through delicious food, making
            every dish memorable and full of warmth. With our masalas, you don’t
            just cook — you share love, tradition, and trust.
          </p>
        </div>
      </div>
    </section>
  );
}
