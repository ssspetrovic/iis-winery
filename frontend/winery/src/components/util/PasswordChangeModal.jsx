import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const PasswordChangeModal = ({ isOpen, toggle, confirm }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [matchPasswords, setMatchPasswords] = useState(false);

  useEffect(() => {
    setMatchPasswords(newPassword === confirmNewPassword);
    console.log("change");
  }, [newPassword, confirmNewPassword]);

  const clearPasswords = () => {
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Change Password</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="new-password" className="my-2">
              New password
            </Label>
            <Input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              valid={matchPasswords}
              invalid={!matchPasswords}
              required
            />
            <Label for="confirm-new-password" className="my-2">
              Confirm new password
            </Label>
            <Input
              type="password"
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              valid={matchPasswords}
              invalid={!matchPasswords}
              required
            />
            {!matchPasswords && (
              <div className="text-danger text-center mt-2">
                Passwords do not match.
              </div>
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={() => {
            clearPasswords();
            confirm(newPassword);
          }}
          disabled={!matchPasswords}
        >
          Confirm
        </Button>
        <Button
          color="danger"
          onClick={() => {
            clearPasswords();
            toggle();
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PasswordChangeModal;
