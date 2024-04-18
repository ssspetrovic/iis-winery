import React, { useState } from "react";
import axios from "../../api/axios";
import {
  Container,
  Input,
  Label,
  Form,
  FormGroup,
  Row,
  Button,
} from "reactstrap";
import ConfirmModal from "../util/ConfirmModal";
import { useNavigate } from "react-router-dom";

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    func: () => {},
  });

  const toggleConfirmModalOpen = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/password_reset/", { email });
      console.log("success");
      console.log(response);
      setModalData({
        header: "Success",
        body: "Password confirmation sent. Please check your email.",
        func: () => navigate("/login"),
      });
      toggleConfirmModalOpen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <Row>
          <div className="text-center">
            <h2 className="display-6 ">Reset password</h2>
          </div>
        </Row>
        <Row className="mt-3">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="reset-password-email">Email:</Label>
              <Input
                id="reset-password-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your associated email"
                required
              />
            </FormGroup>
            <div className="text-center mt-4">
              <Button className="w-100" color="primary">
                Reset Password
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        toggle={toggleConfirmModalOpen}
        data={modalData}
      />
    </div>
  );
};

export default PasswordResetForm;
