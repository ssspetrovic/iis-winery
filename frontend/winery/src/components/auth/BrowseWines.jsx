import { useState } from "react";
import {
  Row,
  Col,
  Container,
  Collapse,
  CardBody,
  Card,
  Alert,
  NavItem,
  NavLink,
} from "reactstrap";

const BrowseWines = () => {
  const [isFilterActive, setIsFilterActive] = useState(false);

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

  return (
    <>
      <Container fluid className="overflow-hidden p-0">
        <Row className="text-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Browse Wines</h1>
          </Col>
        </Row>
        <Row className="text-start">
          <div
            className="filter lead px-4 py-2"
            style={{ display: isFilterActive ? "none" : "block" }}
            onClick={handleClick}
          >
            <i className="fa fa-filter" /> Filter
          </div>
          <Collapse vertical isOpen={isFilterActive}>
            <div className="filter-container border shadow p-3">
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
                    <b>Filter</b>
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
                  <div>Varietal</div>
                </Col>
                <Col xs={6}></Col>
                <Col xs={2} className="text-end">
                  <div className="cursor-pointer" onClick={handleFilter}>
                    Any <i class="fa-solid fa-chevron-right" />
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
                    Any <i class="fa-solid fa-chevron-right" />
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
                    Any <i class="fa-solid fa-chevron-right" />
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
                    Any <i class="fa-solid fa-chevron-right" />
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
                    Any <i class="fa-solid fa-chevron-right" />
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
                    Any <i class="fa-solid fa-chevron-right" />
                  </div>
                </Col>
              </Row>
            </div>
          </Collapse>
        </Row>
      </Container>
    </>
  );
};

export default BrowseWines;
