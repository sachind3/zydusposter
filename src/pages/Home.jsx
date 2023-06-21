import { useContext, useState } from "react";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Navigation, Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const { templates, setSelectedPoster } = useContext(AppContext);
  const temps = templates.reverse();
  const navigate = useNavigate();

  const handleSelect = () => {
    let poster_name = document
      .querySelector(".swiper-slide-active")
      .getAttribute("template-name");
    let docPoster = templates.find((temp) => temp.poster_name === poster_name);
    setSelectedPoster(docPoster);

    navigate("/add-doctor");
  };

  return (
    <div className="px-12 py-4 relative w-full">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: ".prev",
          nextEl: ".next",
        }}
        pagination
        className="border-dashed border border-blue-100 bg-slate-100"
      >
        {temps.map((temp) => {
          return (
            <SwiperSlide key={temp.id} template-name={temp.poster_name}>
              <img
                src={`../templates/${temp.poster_path}/english.png`}
                alt={temp.poster_name}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="swiper-button-prev prev swiperBtn">Prev</div>
      <div className="swiper-button-next next swiperBtn">Next</div>
      <div className="flex items-center justify-center pt-6">
        <button className="btn" type="button" onClick={handleSelect}>
          Select Poster
        </button>
      </div>
    </div>
  );
};
export default Home;
