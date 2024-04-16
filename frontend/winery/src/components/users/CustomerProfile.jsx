import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Label,
  Card,
  CardGroup,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CustomerProfile = () => {
  const axiosPrivate = useAxiosPrivate();

  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState(0);
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState(0);

  const currentDate = new Date(Date.now());
  const dateOfBirth = currentDate.toISOString().split("T")[0]; // Format to "yyyy-MM-dd"

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(`/customers/${username}/`);
      console.log("success: ", response.data.username);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setAddress(response.data.address);
      setStreetNumber(response.data.street_number);
      setCity(response.data.city.name);
      setPostalCode(response.data.city.postal_code);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const edit = () => {
    setIsEditing(true);
  };

  const confirm = async () => {
    setIsEditing(false);

    try {
      const response = await axiosPrivate.patch(`/customers/${username}/`, {
        first_name: firstName,
        last_name: lastName,
        address: address,
        street_number: streetNumber,
        city: {
          name: city,
          postal_code: postalCode,
        },
      });

      console.log(response);
      alert("Information successfully updated!");
    } catch (error) {
      console.log(error);
      alert("Failed to update the information :(\nPlease try again.");
    }
  };

  const discard = async () => {
    setIsEditing(false);
    fetchData();
  };

  return (
    <div className="mx-4">
      <Row className="my-4">
        <Col md="1" className="text-start">
          <div>
            <div className="text-center">
              <i className="fa-3x fa-solid fa-circle-user" />
            </div>
            <div className="text-center">{username}</div>
          </div>
        </Col>
        <Col md="10" className="text-center">
          <h1>Customer Profile</h1>
        </Col>
        <Col md="1" />
      </Row>
      <Row>
        <Col>
          <div className="w-50 mx-auto">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="customer-first-name">
                      First name
                    </Label>
                    <Input
                      id="customer-first-name"
                      className="form-control"
                      name="name"
                      value={firstName}
                      type="text"
                      disabled={!isEditing}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="customer-last-name">
                      Last name
                    </Label>
                    <Input
                      id="customer-last-name"
                      className="form-control"
                      name="last-name"
                      value={lastName}
                      type="text"
                      disabled={!isEditing}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="customer-country">
                      Country
                    </Label>
                    <Input
                      id="customer-country"
                      className="form-control"
                      name="country"
                      value="Serbia"
                      type="text"
                      disabled
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="customer-dob">
                      Date of Birth
                    </Label>
                    <Input
                      id="customer-dob"
                      className="form-control"
                      name="dob"
                      value={dateOfBirth}
                      type="date"
                      disabled
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Label className="form-label" for="customer-address">
                      Address
                    </Label>
                    <Input
                      id="customer-address"
                      className="form-control"
                      name="address"
                      value={address}
                      type="text"
                      disabled={!isEditing}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Col>
                  <Col md="3">
                    <Label className="form-label" for="customer-streetno">
                      Street no.
                    </Label>
                    <Input
                      id="customer-streetno"
                      className="form-control"
                      name="streetno"
                      value={streetNumber}
                      type="number"
                      disabled={!isEditing}
                      onChange={(e) => setStreetNumber(e.target.value)}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col md="9">
                    <Label className="form-label" for="customer-city">
                      City
                    </Label>
                    <Input
                      id="customer-city"
                      className="form-control"
                      name="city"
                      value={city}
                      type="text"
                      disabled={!isEditing}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Col>
                  <Col md="3">
                    <Label className="form-label" for="customer-postal-code">
                      Postal Code
                    </Label>
                    <Input
                      id="customer-postal-code"
                      className="form-control"
                      name="postal-code"
                      value={postalCode}
                      type="number"
                      disabled={!isEditing}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Form>
            <Row className="mt-5">
              <Col md="12" className="text-center">
                <Button
                  className="w-50"
                  color="primary"
                  hidden={isEditing}
                  onClick={edit}
                >
                  Edit
                </Button>
              </Col>
              <Col md="6" className=" text-center">
                <Button
                  className="w-100"
                  color="success"
                  hidden={!isEditing}
                  onClick={confirm}
                >
                  Save
                </Button>
              </Col>
              <Col md="6" className=" text-center">
                <Button
                  className="w-100"
                  color="danger"
                  hidden={!isEditing}
                  onClick={discard}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <hr className="my-5" />
      <Row>
        <CardGroup>
          <Col md="4">
            <Card className="mx-2">
              <CardImg src="..." className="card-img-top" alt="..." />
              <CardBody>
                <CardTitle>Card title</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <Button color="primary">Go somewhere</Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="mx-2">
              <CardImg src="..." className="card-img-top" alt="..." />
              <CardBody>
                <CardTitle>Card title</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <Button color="primary">Go somewhere</Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="mx-2">
              <CardImg src="..." className="card-img-top" alt="..." />
              <CardBody>
                <CardTitle>Card title</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <Button color="primary">Go somewhere</Button>
              </CardBody>
            </Card>
          </Col>
        </CardGroup>
      </Row>
      <hr />
    </div>
  );
};
export default CustomerProfile;
