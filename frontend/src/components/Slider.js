import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../images/slider1.png";
import slider2 from "../images/slider2.png";

const SliderComponent = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const slides = [
    {
      id: 1,
      src: slider1,
      alt: "Slide 1",
    },
    {
      id: 2,
      src: slider2,
      alt: "Slide 2",
    },
  ];

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="w-full h-auto" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
