import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const NotificationPreferencesModal = ({ isOpen, toggle }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { username } = auth || "";

  const [acceptsNotifications, setAcceptsNotifications] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await axiosPrivate.get(`/customers/${username}/`);
        setAcceptsNotifications(response.data.is_allowing_notifications);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    if (isOpen) {
      fetchNotificationSettings();
    }
  }, [axiosPrivate, isOpen, username]);

  const handleSwitchChange = () => {
    setAcceptsNotifications(!acceptsNotifications);
  };

  const handleSave = async () => {
    const response = await axiosPrivate.patch(`/customers/${username}/`, {
      is_allowing_notifications: acceptsNotifications,
    });

    console.log(response.data);
    console.log("Notification Preferences Saved:", acceptsNotifications);
    toggle();
  };

  return (
    <Modal className="text-center" isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Notification Preferences</ModalHeader>
      <ModalBody>
        <p className="lead">
          Here you can manage your notification preferences.
        </p>
        <p className="text-secondary">
          * By allowing notifications, you agree to receiving notifications
          through email adress associated with this account.
        </p>
        <div>
          <div>
            <span>
              Notifications status:{" "}
              {acceptsNotifications ? (
                <span className="text-success">ON</span>
              ) : (
                <span className="text-danger">OFF</span>
              )}
            </span>
          </div>
          <Form>
            <FormGroup switch>
              <div>
                <Label check>
                  <Input
                    className="form-switch-xl"
                    type="switch"
                    checked={acceptsNotifications}
                    onChange={handleSwitchChange}
                  />
                </Label>
              </div>
            </FormGroup>
          </Form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
          Cancel
        </Button>
        <Button color="dark" onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

NotificationPreferencesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default NotificationPreferencesModal;
