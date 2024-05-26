import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardImg, Col, Row } from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const WineRecommendations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axiosPrivate.get("wines/recommendations/get/");
        setRecommendations(response.data);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <Row>
      {recommendations.map((wine) => (
        <Col md={3} key={wine.id} className="p-1">
          <Card className="mb-2 shadow">
            <CardImg
              className="card-img-top"
              src={wine.image}
              alt="wine image"
            />
            <CardBody>
              <CardTitle tag="h5">{wine.name}</CardTitle>
              <p>
                <b>Type:</b> {wine.type}
              </p>
              <p>
                <b>Price:</b> {wine.price} RSD
              </p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WineRecommendations;
