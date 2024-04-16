import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col, FormGroup, Form, Input, Label } from "reactstrap";
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

  useEffect(() => {
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

    fetchData();
  }, []);

  const edit = async () => {
    setIsEditing(true);
  };

  const confirm = () => {
    setIsEditing(false);
  };

  const discard = () => {
    setIsEditing(false);
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
                      placeholder="xx"
                      type="text"
                      value={firstName}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="text"
                      value={lastName}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="text"
                      value="Serbia"
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
                      placeholder="xx"
                      type="date"
                      value={dateOfBirth}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="text"
                      value={address}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="number"
                      value={streetNumber}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="text"
                      value={city}
                      disabled={!isEditing}
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
                      placeholder="xx"
                      type="number"
                      value={postalCode}
                      disabled={!isEditing}
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
    </div>
  );
};
export default CustomerProfile;
