import { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Container,
  Collapse,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";

import wineImage1 from "../../assets/images/wine_4x5_01.jpg";
import wineImage2 from "../../assets/images/wine_4x5_02.jpg";
import wineImage3 from "../../assets/images/wine_4x5_03.jpg";

function getRandomImage() {
  let rand = Math.floor(Math.random() * 3);
  if (rand === 0) {
    return wineImage1;
  } else if (rand === 1) {
    return wineImage2;
  } else {
    return wineImage3;
  }
}

const BrowseWines = () => {
  const axiosPrivate = useAxiosPrivate();

  const [isFilterActive, setIsFilterActive] = useState(true);
  const [wines, setWines] = useState([]);

  const handleClick = () => {
    setIsFilterActive(!isFilterActive);
    console.log("state: ", isFilterActive);
  };

  const resetFilter = () => {
    // TODO
    console.log("reset filter");
  };

  const handleFilter = () => {
    // TODO
  };

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(`/wines/`);
      setWines(response.data);
      console.log(wines);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container fluid className="overflow-hidden p-0">
        <Row className="text-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Browse Wines</h1>
          </Col>
        </Row>
        <Row className="m-2">
          <Col md={3}>
            <Collapse isOpen={isFilterActive}>
              <div className="border shadow p-3">
                <Row>
                  <Col xs={2}>
                    <div
                      className="text-start cursor-pointer"
                      onClick={handleClick}
                    >
                      Close
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div className="text-center">
                      <i className="fa fa-filter" /> Filter
                    </div>
                  </Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={resetFilter}
                    >
                      Reset
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Sweetness</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Availability</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Vintage</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Size & Type</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Price</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Sort by</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={handleFilter}
                    >
                      <div className="me-2">Any</div>
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="text-center mt-4">
                    <Button className="w-50">Apply</Button>
                  </div>
                </Row>
              </div>
            </Collapse>
          </Col>
          <Col md={9}>
            <div className="">
              {wines.map(
                (wine, index) =>
                  index % 4 === 0 && (
                    <Row key={index}>
                      {wines.slice(index, index + 4).map((wine) => (
                        <Col md={3} key={wine.id} className="px-1">
                          <Card className="mb-2 shadow">
                            <CardImg
                              className="card-img-top"
                              src={getRandomImage()}
                              width="40%"
                              alt="wine image"
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
                              <CardSubtitle
                                tag="h6"
                                className="mb-2 text-muted"
                              >
                                <b>Sweetness:</b> {wine.sweetness}
                              </CardSubtitle>
                              <div>
                                <p className="mb-1">
                                  <b>Acidity:</b> {wine.acidity}
                                </p>
                                <p className="mb-1">
                                  <b>Alcohol:</b> {wine.alcohol}
                                </p>
                                <p className="mb-1">
                                  <b>pH:</b> {wine.pH}
                                </p>
                                <p className="mb-1">
                                  <b>Winemaker:</b> {wine.winemaker}
                                </p>
                                <Row className="mt-3">
                                  <Col md={4}>
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                      <Form>
                                        <Input type="number" value={1} />
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
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseWines;
