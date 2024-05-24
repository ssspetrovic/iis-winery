import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { username, role } = auth || {};

  const getProfileLink = () => {
    switch (role) {
      case "ADMIN":
        return `/admin-profile/${username}`;
      case "CUSTOMER":
        return `/customer-profile/${username}`;
      case "MANAGER":
        return `/manager-profile/${username}`;
      default:
        return "/";
    }
  };

  return (
    <>
      <Container fluid className="overflow-hidden p-0 h-100">
        <Row className="text-center align-items-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Welcome to our Winery!</h1>
          </Col>
        </Row>
      </Container>
      <Container className="my-3 py-5">
        <Row>
          <h1 className="display-5 text-center">Select a Quick Link!</h1>
        </Row>
        <Row className="my-3">
          <Col md={4}>
            <div
              className="border shadow rounded my-5 p-5 cursor-pointer bg-dark color-light"
              onClick={() => {
                navigate("/browse");
              }}
            >
              <div className="mx-auto text-center">
                <i className="fa fa-6x fa-magnifying-glass" />
              </div>
              <div className="text-center mt-4">
                <h1 className="display-6">Browse</h1>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="border shadow rounded my-5 p-5 cursor-pointer bg-dark color-light"
              onClick={() => {
                navigate(getProfileLink());
              }}
            >
              <div className="mx-auto text-center">
                <i className="fa fa-6x fa-user" />
              </div>
              <div className="text-center mt-4">
                <h1 className="display-6">Profile</h1>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="border shadow rounded my-5 p-5 cursor-pointer bg-dark color-light"
              onClick={() => {
                navigate("/profile/cart");
              }}
            >
              <div className="mx-auto text-center">
                <i className="fa fa-6x fa-shopping-cart" />
              </div>
              <div className="text-center mt-4">
                <h1 className="display-6">Cart</h1>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
