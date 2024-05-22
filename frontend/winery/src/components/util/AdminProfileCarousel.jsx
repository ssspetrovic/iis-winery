import React from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";

// Import slika
import ViewUsersImage from "../../assets/images/view_users_image.jpg";
import ViewReportsImage from "../../assets/images/view_reports_image.jpg";
import ViewVehiclesImage from "../../assets/images/view_vehicles_image.jpg";
import GeneratePDFImage from "../../assets/images/generate_pdf_image.jpg";
import "../../assets/adminCarousel.css";

const AdminProfileCarousel = ({ username }) => {
  const items = [
    {
      src: "/view-users",
      altText: "View Users",
      image: ViewUsersImage,
    },
    {
      src: "/view-reports",
      altText: "View Reports",
      image: ViewReportsImage,
    },
    {
      src: "/view-vehicles",
      altText: "View Vehicles",
      image: ViewVehiclesImage,
    },
    {
      src: `/admin-profile/${username}/generate-pdf`,
      altText: "Generate PDF",
      image: GeneratePDFImage,
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem key={item.src}>
        <Link to={item.src}>
          <img src={item.image} alt={item.altText} className="img-fluid" />
          <div className="carousel-caption">
            <span style={{ fontWeight: "bold" }}>{item.altText}</span>
          </div>
        </Link>
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      className="text-center carousel-container"
    >
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={() => {}}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
};

export default AdminProfileCarousel;
