import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Button, Row, Col, Container, Input } from "reactstrap";
import ConfirmModal from "../util/ConfirmModal";

const WineQuantity = () => {
  const axiosPrivate = useAxiosPrivate();
  const [wines, setWines] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const modalData = {
    header: "Success",
    body: "Wine quantities successfully updated",
    func: () => {},
  };

  const toggleConfirmModalOpen = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get("/wines/");
      setWines(response.data);
      const initialQuantities = response.data.reduce((acc, wine) => {
        acc[wine.id] = wine.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  const handleConfirm = async () => {
    try {
      const requests = wines.map((wine) => {
        const updatedQuantity = quantities[wine.id];
        return axiosPrivate.patch(`/wines/${wine.id}/`, {
          quantity: updatedQuantity,
        });
      });
      await Promise.all(requests);
      console.log("Quantities updated successfully");
      toggleConfirmModalOpen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <div className="div-center lead">
        <Row className="my-2">
          <Col md={9} className="px-4 text-start">
            <b>Wine</b>
          </Col>
          <Col md={3} className="px-4 text-end">
            <b>Quantity</b>
          </Col>
        </Row>
        {wines.map((wine) => (
          <Row key={wine.id}>
            <Col md={9}>
              {wine.id}. {wine.name}
            </Col>
            <Col md={3}>
              <Input
                type="number"
                className="text-center"
                value={quantities[wine.id]}
                onChange={(e) => handleQuantityChange(wine.id, e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Row className="my-4 mx-1">
          <Button
            color="dark"
            className="mx-auto w-100"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Row>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        toggle={toggleConfirmModalOpen}
        data={modalData}
      />
    </Container>
  );
};

export default WineQuantity;
