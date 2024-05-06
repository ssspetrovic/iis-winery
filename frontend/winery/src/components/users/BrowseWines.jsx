import { useState, useEffect, useMemo, memo } from "react";
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
  InputGroup,
} from "reactstrap";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";

import wineImage1 from "../../assets/images/wine_4x5_01.jpg";
import wineImage2 from "../../assets/images/wine_4x5_02.jpg";
import wineImage3 from "../../assets/images/wine_4x5_03.jpg";

function getRandomImage(index) {
  switch (index % 3) {
    case 0:
      return wineImage1;
    case 1:
      return wineImage2;
    case 2:
      return wineImage3;
    default:
      return wineImage1; // Default image
  }
}

const BrowseWines = () => {
  const axiosPrivate = useAxiosPrivate();

  const [isFilterActive, setIsFilterActive] = useState(true);
  const [wines, setWines] = useState([]);

  const [isSweetnessTabOpen, setIsSweetnessTabOpen] = useState(false);
  const [isAvailabilityTabOpen, setIsAvailabilityTabOpen] = useState(false);
  const [isAgeTabOpen, setIsAgeTabOpen] = useState(false);
  const [isTypeTabOpen, setIsTypeTabOpen] = useState(false);
  const [isSortByTabOpen, setIsSortByTabOpen] = useState(false);

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

  // Add state variables for sweetness filter
  const [selectedSweetness, setSelectedSweetness] = useState([]);

  // Function to handle sweetness filter change
  const handleSweetnessChange = (event) => {
    const { value, checked } = event.target;
    console.log(value);
    console.log(checked);
    if (checked) {
      setSelectedSweetness([...selectedSweetness, value]);
    } else {
      setSelectedSweetness(selectedSweetness.filter((item) => item !== value));
    }
  };

  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      console.log(selectedSweetness.length);
      if (selectedSweetness.length === 0) return wines;
      console.log(wine.name);
      console.log(selectedSweetness);
      console.log(selectedSweetness.includes(wine.sweetness));
      return selectedSweetness.includes(wine.sweetness);
    });
  }, [wines, selectedSweetness]);

  const sortWines = (type) => {
    console.log("sorting by", type);
    if (type === "price") {
      // TODO: Sort by price
    } else {
      // TODO: Sort by name
    }
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

  const memoizedCards = useMemo(() => {
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
                                  <Input id="wine-quantity" type="number" />
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
  }, [filteredWines]);

  return (
    <>
      <Container fluid className="overflow-hidden p-0">
        <Row className="text-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Browse Wines</h1>
          </Col>
        </Row>
        <Row className="">
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
                      onClick={() => {
                        setIsSweetnessTabOpen(!isSweetnessTabOpen);
                        console.log("xd");
                        console.log(isSweetnessTabOpen);
                      }}
                    >
                      <div className="me-2">Any</div>
                      <i
                        className={`fa-solid fa-chevron-${
                          isSweetnessTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                  <Collapse isOpen={isSweetnessTabOpen} className="w-100 mt-2">
                    <div className="d-flex flex-column">
                      <FormGroup>
                        <InputGroup>
                          <Row>
                            <span>
                              <Input
                                id="sweetness-dry"
                                type="checkbox"
                                className="mb-1 mx-1"
                                onChange={handleSweetnessChange}
                                value="Dry"
                              />{" "}
                              Dry
                            </span>
                            <span>
                              <Input
                                id="sweetness-medium"
                                type="checkbox"
                                className="mb-1 mx-1"
                                onChange={handleSweetnessChange}
                                value="Medium"
                              />{" "}
                              Medium
                            </span>
                            <span>
                              <Input
                                id="sweetness-sweet"
                                type="checkbox"
                                className="mb-1 mx-1"
                                onChange={handleSweetnessChange}
                                value="Sweet"
                              />{" "}
                              Sweet
                            </span>
                          </Row>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Collapse>
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
                      onClick={() => {
                        setIsAvailabilityTabOpen(!isAvailabilityTabOpen);
                        console.log("xd");
                        console.log(isAvailabilityTabOpen);
                      }}
                    >
                      <div className="me-2">Any</div>
                      <i
                        className={`fa-solid fa-chevron-${
                          isAvailabilityTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                  <Collapse
                    isOpen={isAvailabilityTabOpen}
                    className="w-100 mt-2"
                  >
                    <div className="d-flex flex-column">
                      <FormGroup>
                        <InputGroup>
                          <Row>
                            <span>
                              <Input
                                id="availability"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              Show only available wines
                            </span>
                          </Row>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Collapse>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Age</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={() => {
                        setIsAgeTabOpen(!isAgeTabOpen);
                        console.log("xd");
                        console.log(isAgeTabOpen);
                      }}
                    >
                      <div className="me-2">Any</div>
                      <i
                        className={`fa-solid fa-chevron-${
                          isAgeTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                  <Collapse isOpen={isAgeTabOpen} className="w-100 mt-2">
                    <div className="d-flex flex-column">
                      <FormGroup>
                        <InputGroup>
                          <Row>
                            <span>
                              <Input
                                id="age-vintage"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              Vintage
                            </span>
                            <span>
                              <Input
                                id="age-non-vintage"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              Non vintage
                            </span>
                          </Row>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Collapse>
                </Row>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Type</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div
                      className="d-flex align-items-center justify-content-end cursor-pointer"
                      onClick={() => {
                        setIsTypeTabOpen(!isTypeTabOpen);
                        console.log("xd");
                        console.log(isTypeTabOpen);
                      }}
                    >
                      <div className="me-2">Any</div>
                      <i
                        className={`fa-solid fa-chevron-${
                          isTypeTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                  <Collapse isOpen={isTypeTabOpen} className="w-100 mt-2">
                    <div className="d-flex flex-column">
                      <FormGroup>
                        <InputGroup>
                          <Row>
                            <span>
                              <Input
                                id="type-red"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              Red
                            </span>
                            <span>
                              <Input
                                id="type-white"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              White
                            </span>
                            <span>
                              <Input
                                id="type-rose"
                                type="checkbox"
                                className="mb-1 mx-1"
                              />{" "}
                              Rose
                            </span>
                          </Row>
                        </InputGroup>
                      </FormGroup>
                    </div>
                  </Collapse>
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
                      onClick={() => {
                        setIsSortByTabOpen(!isSortByTabOpen);
                        console.log("xd");
                        console.log(isSortByTabOpen);
                      }}
                    >
                      <div className="me-2">Any</div>
                      <i
                        className={`fa-solid fa-chevron-${
                          isSortByTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                  <Collapse isOpen={isSortByTabOpen} className="w-100 mt-2">
                    <div className="d-flex flex-column">
                      <Row>
                        <span
                          className="mx-3 cursor-pointer"
                          style={{ textDecoration: "underline" }}
                          onClick={() => {
                            sortWines("price");
                          }}
                        >
                          Price
                        </span>
                        <span
                          className="mx-3 cursor-pointer"
                          style={{ textDecoration: "underline" }}
                          onClick={() => {
                            sortWines("name");
                          }}
                        >
                          Name
                        </span>
                      </Row>
                    </div>
                  </Collapse>
                </Row>
                <Row>
                  <div className="text-center mt-4">
                    <Button className="w-50">Apply</Button>
                  </div>
                </Row>
              </div>
            </Collapse>
          </Col>
          <Col md={9}>{memoizedCards}</Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseWines;
