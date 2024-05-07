import React, { useMemo } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  Form,
  Input,
} from "reactstrap";

const WineCards = ({ filteredWines }) => {
  return filteredWines.length > 0 ? (
    filteredWines.map(
      (wine, outerIndex) =>
        outerIndex % 4 === 0 && (
          <Row key={outerIndex}>
            {filteredWines
              .slice(outerIndex, outerIndex + 4)
              .map((wine, innerIndex) => (
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
                                  id="wine-quantity"
                                  type="number"
                                  className="text-center px-1"
                                />
                              </Form>
                            </div>
                          </Col>
                          <Col md={8}>
                            <div className="text-center my-auto">
                              <Button color="dark" className="w-100">
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

export default WineCards;
