import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  InputGroup,
  Input,
  Button,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

const ShoppingCart = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cookies] = useCookies(["cart_id"]);

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const fetchCartItems = async () => {
    try {
      const cartId = cookies.cart_id;
      const response = await axiosPrivate.get(
        `/cart-items/?shopping_cart=${cartId}`
      );
      const fetchedCartItems = response.data;

      const initialQuantities = {};
      fetchedCartItems.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });
      setSelectedQuantities(initialQuantities);

      setCartItems(fetchedCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = (itemId, quantity, maxQuantity) => {
    if (quantity > maxQuantity) {
      quantity = maxQuantity;
    }

    setSelectedQuantities({
      ...selectedQuantities,
      [itemId]: parseInt(quantity) || 1,
    });
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axiosPrivate.delete(`/cart-items/${itemId}/`);
      console.log(response.data);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = selectedQuantities[item.id] || item.quantity;
      return total + (selectedItems[item.id] ? item.wine.price * quantity : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const items = Object.keys(selectedItems).map((itemId) =>
        parseInt(itemId)
      );
      const customer = cookies.username; // assuming the username is stored in cookies

      const response = await axiosPrivate.post("/orders/", { items, customer });

      if (response.status === 201) {
        console.log("Order created successfully:", response.data);
        // Clear the cart after successful checkout
        setCartItems([]);
        setSelectedItems({});
        setSelectedQuantities({});
      } else {
        console.error("Error creating order:", response.data);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <Container fluid className="overflow-hidden p-0 h-100">
        <Row className="text-center align-items-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">Your shopping cart</h1>
          </Col>
        </Row>
      </Container>
      <Row className="text-center p-5 mx-5">
        <Col md={8}>
          {cartItems.length > 0 ? (
            <div className="rounded shadow ">
              <Table hover className="rounded overflow-hidden">
                <thead>
                  <tr>
                    <th></th>
                    <th>Wine</th>
                    <th>Type</th>
                    <th>Price (RSD)</th>
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">
                        <InputGroup className="d-flex justify-content-end">
                          <Input
                            type="checkbox"
                            checked={selectedItems[item.id] || false}
                            onChange={(e) =>
                              setSelectedItems({
                                ...selectedItems,
                                [item.id]: e.target.checked,
                              })
                            }
                          />
                        </InputGroup>
                      </td>
                      <td className="align-middle">
                        <div>
                          <img
                            src={item.wine.image}
                            alt="wine image"
                            className="cart-img mr-2 rounded rounded-sm"
                          />
                        </div>
                        <div className="my-1">{item.wine.name}</div>
                      </td>
                      <td className="align-middle">{item.wine.type}</td>
                      <td className="align-middle">{item.wine.price}</td>
                      <td className="align-middle">
                        <div>
                          <InputGroup className=" w-50 mx-auto text-center">
                            <Input
                              type="number"
                              min="1"
                              max={item.wine.quantity}
                              className="text-center px-1"
                              value={selectedQuantities[item.id] || 1}
                              onChange={(e) => {
                                updateQuantity(
                                  item.id,
                                  e.target.value,
                                  item.wine.quantity
                                );
                                calculateTotal();
                              }}
                            />
                          </InputGroup>
                        </div>
                        <div>
                          <small className="text-secondary">
                            In stock: {item.wine.quantity}
                          </small>
                        </div>
                      </td>
                      <td className="align-middle">
                        <i
                          className="fa fa-lg fa-trash mx-2 cursor-pointer"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
              <h2>No items in cart :(</h2>
              <p>
                Please <a href="/browse">click here</a> to browse for items.
              </p>
            </div>
          )}
        </Col>
        <Col md={4}>
          <div>
            <Row className="border rounded shadow py-2 g-0">
              <Row className="m-0">
                <div className="text-start">
                  <h3>Summary</h3>
                </div>
              </Row>
              <hr />
              <Row className="m-0">
                <div className="text-start">
                  <h6>Selected items:</h6>
                  {Object.values(selectedItems).some((item) => item) ? (
                    cartItems.map((item, index) => {
                      if (selectedItems[item.id]) {
                        const quantity =
                          selectedQuantities[item.id] || item.quantity;
                        return (
                          <div key={index}>
                            <small className="text-secondary px-2">
                              - {item.wine.name} x {quantity} -{" "}
                              <b>{item.wine.price * quantity} RSD</b>
                            </small>
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <div>Please select some items first!</div>
                  )}
                </div>
              </Row>

              <hr className="my-3" />
              <Row className="m-0">
                <Col md={2}>
                  <div>
                    <h5>Total:</h5>
                  </div>
                </Col>
                <Col md={10}>
                  <div className="text-end lead px-0 mx-0">
                    <h5 className="p-0 ">{calculateTotal()} RSD</h5>
                  </div>
                </Col>
              </Row>
              <Row className="m-0">
                <div className="px-4">
                  <Button
                    color="dark m-2 w-100 mx-auto"
                    disabled={Object.values(selectedItems).every(
                      (item) => !item
                    )}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </Row>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ShoppingCart;
