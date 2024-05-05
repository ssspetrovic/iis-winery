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
} from "reactstrap";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";

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
                  <Col xs={2}>
                    <div
                      className="text-end cursor-pointer"
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
                    <div className="cursor-pointer" onClick={handleFilter}>
                      Any <i className="fa-solid fa-chevron-right" />
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
            <div>
              {wines.map((wine) => (
                <Card className="mb-2 shadow">
                  <CardImg top width="100%" src={wine.image} alt={wine.name} />
                  <CardBody>
                    <CardTitle tag="h5">{wine.name}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                      Sweetness: {wine.sweetness}
                    </CardSubtitle>
                    <p>Acidity: {wine.acidity}</p>
                    <p>Alcohol: {wine.alcohol}</p>
                    <p>pH: {wine.pH}</p>
                    <p>Winemaker: {wine.winemaker}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseWines;
