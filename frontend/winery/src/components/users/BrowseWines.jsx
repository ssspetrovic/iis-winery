import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Row,
  Col,
  Container,
  Collapse,
  Input,
  InputGroup,
} from "reactstrap";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";

import WineCards from "../util/WineCards";

const BrowseWines = () => {
  const axiosPrivate = useAxiosPrivate();

  const [isFilterActive, setIsFilterActive] = useState(true);
  const [wines, setWines] = useState([]);

  const [isSweetnessTabOpen, setIsSweetnessTabOpen] = useState(false);
  const [isAvailabilityTabOpen, setIsAvailabilityTabOpen] = useState(false);
  const [isAgeTabOpen, setIsAgeTabOpen] = useState(false);
  const [isTypeTabOpen, setIsTypeTabOpen] = useState(false);
  const [isSortByTabOpen, setIsSortByTabOpen] = useState(false);

  const [selectedSweetness, setSelectedSweetness] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedSort, setSelectedSort] = useState("name");

  const handleSortChange = (event) => {
    const { value } = event.target;
    if (value === "price-lower") {
      setSelectedSort("price-lower");
    } else if (value === "price-higher") {
      setSelectedSort("price-higher");
    } else {
      setSelectedSort(value);
    }
  };

  const handleClick = () => {
    setIsFilterActive(!isFilterActive);
    console.log("state: ", isFilterActive);
  };

  const resetFilter = () => {
    setSelectedSweetness([]);
    setSelectedType([]);
    setSelectedAge([]);
    setSelectedSort("");
  };

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

  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    console.log(value);
    console.log(checked);
    if (checked) {
      setSelectedType([...selectedType, value]);
    } else {
      setSelectedType(selectedType.filter((item) => item !== value));
    }
  };

  const handleAgeChange = (event) => {
    const { value, checked } = event.target;
    console.log(value);
    console.log(checked);
    if (checked) {
      setSelectedAge([...selectedAge, value]);
    } else {
      setSelectedAge(selectedAge.filter((item) => item !== value));
    }
  };

  const filteredWines = useMemo(() => {
    let filteredList = wines.filter((wine) => {
      if (
        selectedSweetness.length === 0 &&
        selectedType.length === 0 &&
        selectedAge.length === 0
      )
        return true;

      if (
        selectedSweetness.length > 0 &&
        !selectedSweetness.includes(wine.sweetness)
      )
        return false;

      if (selectedType.length > 0 && !selectedType.includes(wine.type))
        return false;

      if (selectedAge.length > 0 && !selectedAge.includes(wine.age))
        return false;

      return true;
    });

    // Sorting logic
    if (selectedSort === "price-lower") {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-higher") {
      filteredList.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "name") {
      filteredList.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredList;
  }, [wines, selectedSweetness, selectedType, selectedAge, selectedSort]);

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

  const memoizedCards = useMemo(
    () => <WineCards filteredWines={filteredWines} />,
    [filteredWines]
  );

  return (
    <>
      <Container fluid className="overflow-hidden p-0">
        <Row className="text-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Browse Wines</h1>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Collapse isOpen={isFilterActive}>
              <div className="border shadow p-3">
                <Row>
                  <Col xs={2} />
                  <Col xs={8}>
                    <div className="text-center lead">
                      <i className="fa fa-filter" /> Filter Options
                    </div>
                  </Col>
                  <Col xs={2} className="text-end" />
                </Row>
                <hr />
                <Row
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSweetnessTabOpen(!isSweetnessTabOpen);
                  }}
                >
                  <Col xs={4} className="text-start">
                    <div>Sweetness</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end ">
                      <i
                        className={`fa-solid fa-chevron-${
                          isSweetnessTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={isSweetnessTabOpen} className="w-100 mt-2">
                  <div
                    className="d-flex flex-column"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InputGroup>
                      <Row>
                        <span>
                          <Input
                            id="sweetness-dry"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onChange={handleSweetnessChange}
                            value="Dry"
                          />{" "}
                          Dry
                        </span>
                        <span>
                          <Input
                            id="sweetness-medium"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onChange={handleSweetnessChange}
                            value="Medium"
                          />{" "}
                          Medium
                        </span>
                        <span>
                          <Input
                            id="sweetness-sweet"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onChange={handleSweetnessChange}
                            value="Sweet"
                          />{" "}
                          Sweet
                        </span>
                      </Row>
                    </InputGroup>
                  </div>
                </Collapse>
                <hr />
                <Row
                  className="cursor-pointer"
                  onClick={() => {
                    setIsAvailabilityTabOpen(!isAvailabilityTabOpen);
                  }}
                >
                  <Col xs={4} className="text-start">
                    <div>Availability</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end cursor-pointer">
                      <i
                        className={`fa-solid fa-chevron-${
                          isAvailabilityTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={isAvailabilityTabOpen} className="w-100 mt-2">
                  <div
                    className="d-flex flex-column"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InputGroup>
                      <Row>
                        <span>
                          <Input
                            id="availability"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                          />{" "}
                          Only show available wines
                        </span>
                      </Row>
                    </InputGroup>
                  </div>
                </Collapse>
                <hr />
                <Row
                  className="cursor-pointer"
                  onClick={() => {
                    setIsAgeTabOpen(!isAgeTabOpen);
                  }}
                >
                  <Col xs={4} className="text-start">
                    <div>Age</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end cursor-pointer">
                      <i
                        className={`fa-solid fa-chevron-${
                          isAgeTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={isAgeTabOpen} className="w-100 mt-2">
                  <div
                    className="d-flex flex-column"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InputGroup>
                      <Row>
                        <span>
                          <Input
                            id="age-vintage"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleAgeChange}
                            value="Vintage"
                          />{" "}
                          Vintage
                        </span>
                        <span>
                          <Input
                            id="age-non-vintage"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleAgeChange}
                            value="Non-vintage"
                          />{" "}
                          Non-vintage
                        </span>
                      </Row>
                    </InputGroup>
                  </div>
                </Collapse>
                <hr />
                <Row
                  className="cursor-pointer"
                  onClick={() => {
                    setIsTypeTabOpen(!isTypeTabOpen);
                  }}
                >
                  <Col xs={4} className="text-start">
                    <div>Type</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end cursor-pointer">
                      <i
                        className={`fa-solid fa-chevron-${
                          isTypeTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={isTypeTabOpen} className="w-100 mt-2">
                  <div
                    className="d-flex flex-column"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InputGroup>
                      <Row>
                        <span>
                          <Input
                            id="type-red"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleTypeChange}
                            value="Red"
                          />{" "}
                          Red
                        </span>
                        <span>
                          <Input
                            id="type-white"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleTypeChange}
                            value="White"
                          />{" "}
                          White
                        </span>
                        <span>
                          <Input
                            id="type-rose"
                            type="checkbox"
                            className="mb-1 mx-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleTypeChange}
                            value="Rose"
                          />{" "}
                          Rose
                        </span>
                      </Row>
                    </InputGroup>
                  </div>
                </Collapse>
                <hr />
                <Row>
                  <Col xs={4} className="text-start">
                    <div>Price</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end cursor-pointer">
                      <i className="fa-solid fa-chevron-right" />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSortByTabOpen(!isSortByTabOpen);
                  }}
                >
                  <Col xs={4} className="text-start">
                    <div>Sort by</div>
                  </Col>
                  <Col xs={6}></Col>
                  <Col xs={2} className="text-end">
                    <div className="d-flex align-items-center justify-content-end cursor-pointer">
                      <i
                        className={`fa-solid fa-chevron-${
                          isSortByTabOpen ? "down" : "right"
                        }`}
                      />
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={isSortByTabOpen} className="w-100 mt-2">
                  <div
                    className="d-flex flex-column"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InputGroup>
                      <Row>
                        <label className="mx-1">
                          <Input
                            type="radio"
                            id="sort-price-lower"
                            value="price-lower"
                            checked={selectedSort === "price-lower"}
                            onChange={handleSortChange}
                          />{" "}
                          Price (Lower First)
                        </label>
                        <label className="mx-1">
                          <Input
                            type="radio"
                            id="sort-price-higher"
                            value="price-higher"
                            checked={selectedSort === "price-higher"}
                            onChange={handleSortChange}
                          />{" "}
                          Price (Higher First)
                        </label>
                        <label className="mx-1">
                          <Input
                            type="radio"
                            id="sort-name"
                            value="name"
                            checked={selectedSort === "name"}
                            onChange={handleSortChange}
                          />{" "}
                          Name
                        </label>
                      </Row>
                    </InputGroup>
                  </div>
                </Collapse>
                <Row>
                  <div className="text-center mt-4">
                    <Button className="w-50" onClick={resetFilter}>
                      Reset
                    </Button>
                  </div>
                </Row>
              </div>
            </Collapse>
          </Col>
          <Col md={9} className="p-0">
            <div className="px-4">{memoizedCards}</div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseWines;
