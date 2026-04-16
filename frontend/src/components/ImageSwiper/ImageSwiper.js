import React from "react";
import "./ImageSwiper.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const ImageSwiper = (props) => {
  const { images, onclick = true } = props;
  const navigate = useNavigate();
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop
      onClick={() => onclick && navigate("/list/all")}
    >
      {images.length > 0 &&
        images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`slide${index + 1}`} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ImageSwiper;
