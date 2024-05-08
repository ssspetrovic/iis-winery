import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  Col,
  Form,
  Input,
  Row,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

const WineCardsTest = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cookies] = useCookies(["cart_id"]);

  const [wines, setWines] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(`/wines/`);
      setWines(response.data);
    } catch (error) {
      console.error("Error fetching wines:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = async (wine) => {
    try {
      const selectedQuantity = selectedQuantities[wine.id] || 1;
      const cartId = cookies.cart_id;
      const response = await axiosPrivate.post("/cart-items/", {
        shopping_cart: cartId,
        wine: wine.id,
        quantity: selectedQuantity,
      });
      console.log(response.data);
      if (response.data.created) {
        console.log(`Added new item to cart: ${wine.name}`);
      } else {
        console.log(`Updated quantity of existing item in cart: ${wine.name}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return wines.length > 0 ? (
    wines.map(
      (wine, outerIndex) =>
        outerIndex % 4 === 0 && (
          <Row key={outerIndex}>
            {wines.slice(outerIndex, outerIndex + 4).map((wine, innerIndex) => (
              <Col md={3} key={innerIndex} className="p-1">
                <Card className="mb-2 shadow">
                  <CardImg
                    className="card-img-top"
                    src={wine.image}
                    alt="wine image"
                    loading="eager"
                  />
                  <CardBody>
                    <Row>
                      <Col md={10}>
                        <CardTitle tag="h5">{wine.name}</CardTitle>
                      </Col>
                      <Col md={2}>
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <i className="fa fa-heart"></i>
                        </div>
                      </Col>
                    </Row>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                      <b>Type:</b> {wine.type}
                    </CardSubtitle>
                    <div>
                      <p className="mb-1">
                        <b>Sweetness:</b> {wine.sweetness}
                      </p>
                      <p className="mb-1">
                        <b>Age:</b> {wine.age}
                      </p>
                      <p className="mb-1">
                        <b>Winemaker:</b> {wine.winemaker}
                      </p>
                      <hr />
                      <p className="mb-1 text-center lead">
                        <b>{wine.price} RSD</b>
                      </p>
                      <p className="mb-1 text-center">
                        <b>In stock:</b> {wine.quantity}
                      </p>
                      <Row className="mt-3">
                        <Col md={4}>
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Form>
                              <Input
                                id={`wine-quantity-${wine.id}`}
                                type="number"
                                min="1" // Disable values below 1
                                className="text-center px-1"
                                value={selectedQuantities[wine.id] || "1"} // Set default value to 1
                                onChange={(e) =>
                                  setSelectedQuantities({
                                    ...selectedQuantities,
                                    [wine.id]: e.target.value,
                                  })
                                }
                              />
                            </Form>
                          </div>
                        </Col>
                        <Col md={8}>
                          <div className="text-center my-auto">
                            <Button
                              color="dark"
                              className="w-100"
                              onClick={() => {
                                addToCart(wine);
                              }}
                            >
                              <small>Add to cart</small>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )
    )
  ) : (
    <div className="text-center my-4">
      <h1 className="lead">No wines matching the given criteria found.</h1>
    </div>
  );
};

export default WineCardsTest;
