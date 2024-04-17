import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ConfirmModal = ({ isOpen, toggle, data }) => {
  const { header, body, func } = data;

  return (
    <Modal isOpen={isOpen} toggle={toggle} onExit={func} centered>
      <ModalHeader toggle={toggle}>
        <div>{header}</div>
      </ModalHeader>
      <ModalBody>
        <div>
          <p>{body}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="text-center mx-auto w-50">
          <Button
            className="w-100"
            color="primary"
            onClick={() => {
              toggle();
              func && func();
            }}
          >
            OK
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
