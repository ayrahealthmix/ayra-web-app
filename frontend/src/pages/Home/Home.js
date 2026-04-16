import "./Home.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import jsonData from "../../services/data.json";
import CategoryMasalaImg from "../../assets/images/cat-masala.png";
import CategoryHealthMixImg from "../../assets/images/cat-mix.png";
import CategoryFlourImg from "../../assets/images/cat-malt.png";
import { Link } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";
import ImageSwiper from "../../components/ImageSwiper/ImageSwiper";
import SwiperImage1 from "../../assets/banners/masala-banner.png";
import SwiperImage2 from "../../assets/banners/malt-banner.png";
import SwiperImage3 from "../../assets/banners/mixes-banner.png";

export default function Home() {
  const isMobile = useIsMobile();
  const { categoryHighlights } = jsonData;
  const categoryImages = {
    masala: CategoryMasalaImg,
    "health-mix": CategoryHealthMixImg,
    flour: CategoryFlourImg,
  };

  return (
    <section className="home">
      <div className="swiper-cntnr" data-aos="zoom-in">
        <ImageSwiper images={[SwiperImage1, SwiperImage2, SwiperImage3]} />
      </div>
      <div className="category-highlts-main">
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
              data-aos="fade-down"
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
