import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  UncontrolledTooltip,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PasswordChangeModal from "../util/PasswordChangeModal";
import wineImage1 from "../../assets/images/wine_01.jpg";
import wineImage2 from "../../assets/images/wine_02.jpg";
import wineImage3 from "../../assets/images/wine_03.jpg";
import ConfirmModal from "../util/ConfirmModal";

const CustomerProfile = () => {
  const axiosPrivate = useAxiosPrivate();

  const { username } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState(0);
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const togglePasswordChangeModal = () => {
    setIsPasswordChangeModalOpen(!isPasswordChangeModalOpen);
  };

  const toggleConfirmModalOpen = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    func: () => {},
  });

  const getDateString = (date) => {
    const splitted = date.split("-");
    return `${splitted[2]}.${splitted[1]}.${splitted[0]}.`;
  };

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(`/customers/${username}/`);
      console.log("success: ", response.data.username);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setDateOfBirth(getDateString(response.data.date_of_birth));
      setAddress(response.data.address);
      setStreetNumber(response.data.street_number);
      setCity(response.data.city.name);
      setPostalCode(response.data.city.postal_code);
      console.log(response.data);
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
      // alert("Information successfully updated!");
      setModalData({
        header: "Success!",
        body: "Information successfully updated!",
      });
      toggleConfirmModalOpen();
    } catch (error) {
      console.log(error);
      // alert("Failed to update the information :(\nPlease try again.");
      setModalData({
        header: "Editing info failed!",
        body: "Failed to update the profile info!",
      });
      toggleConfirmModalOpen();
    }
  };

  const discard = async () => {
    setIsEditing(false);
    fetchData();
  };

  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const changePassword = async (newPassword) => {
    try {
      const response = await axiosPrivate.patch(`/customers/${username}/`, {
        password: newPassword,
      });
      console.log(response);
      // alert("Password successfully changed!");
      setModalData({
        header: "Success!",
        body: "Password successfully changed!",
      });
      toggleConfirmModalOpen();
      setIsPasswordChangeModalOpen(false);
    } catch (error) {
      console.log(error);
      alert("Failed to change the password :(\nPlease try again.");
    }
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
                    <Label
                      id="customer-country-label"
                      className="form-label"
                      for="customer-country"
                    >
                      Country <span className="text-danger">*</span>
                    </Label>
                    <UncontrolledTooltip
                      className="mx-3"
                      placement="right"
                      target="customer-country-label"
                    >
                      We only ship to Serbia.
                    </UncontrolledTooltip>
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
                    <Label
                      id="customer-dob-label"
                      className="form-label"
                      for="customer-dob"
                    >
                      Date of Birth <span className="text-danger">*</span>
                    </Label>
                    <UncontrolledTooltip
                      className="mx-3"
                      placement="right"
                      target="customer-dob-label"
                    >
                      Birth date cannot be changed.
                    </UncontrolledTooltip>
                    <Input
                      id="customer-dob"
                      className="form-control"
                      name="dob"
                      value={dateOfBirth}
                      type="text"
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
            <Row className="mt-4">
              <Col md="12" className="text-center">
                <Button
                  className="w-50"
                  color="dark"
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
              <Col md="6" className="text-center">
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
            <Row>
              <Col md="12" className="text-center mt-2">
                <p>
                  Looking to change the password?
                  <Link className="mx-1" onClick={togglePasswordChangeModal}>
                    Click here
                  </Link>
                  <PasswordChangeModal
                    isOpen={isPasswordChangeModalOpen}
                    toggle={togglePasswordChangeModal}
                    confirm={changePassword}
                  />
                </p>
              </Col>
            </Row>
          </div>
        </Col>
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          toggle={toggleConfirmModalOpen}
          data={modalData}
        />
      </Row>
      <hr className="my-4" />
      <Row>
        <h3 className="mb-3">You might be interested in</h3>
      </Row>
      <Row>
        <CardGroup>
          <Col md="4">
            <Card className="mx-2">
              <CardImg
                src={wineImage1}
                className="card-img-top"
                alt="wine image"
              />
              <CardBody>
                <CardTitle>First Wine Sample</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <div className="text-center">
                  <Button color="dark">Learn more</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="mx-2">
              <CardImg
                src={wineImage2}
                className="card-img-top"
                alt="wine image"
              />
              <CardBody>
                <CardTitle>Second Wine Sample</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <div className="text-center">
                  <Button color="dark">Learn more</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="mx-2">
              <CardImg
                src={wineImage3}
                className="card-img-top"
                alt="wine image"
              />
              <CardBody>
                <CardTitle>Third Wine Sample</CardTitle>
                <CardText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente corporis iusto impedit delectus laboriosam. Sunt
                  aperiam eius suscipit est explicabo. Sed beatae nihil est vel
                  vitae quibusdam debitis earum fugit?
                </CardText>
                <div className="text-center">
                  <Button color="dark">Learn more</Button>
                </div>
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
