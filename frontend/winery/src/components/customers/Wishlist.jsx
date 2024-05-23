import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const Wishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);

  const { auth } = useAuth();
  const { username } = auth || {};

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(
        `/wishlists/?customer=${username}`
      );
      const wishlistItems = response.data.flatMap((wishlist) =>
        wishlist.items.map((item) => ({
          wishlistItemId: item.id,
          wine: item.wine,
        }))
      );
      setItems(wishlistItems);
    } catch (error) {
      console.error("Error fetching wines:", error);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      const response = await axiosPrivate.delete(
        `/wishlist-items/${wishlistItemId}/`
      );
      console.log(response.data);
      setItems(items.filter((item) => item.wishlistItemId !== wishlistItemId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <>
      <Container fluid className="overflow-hidden p-0 h-100">
        <Row className="text-center align-items-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">My Wishlist</h1>
          </Col>
        </Row>
      </Container>
      <Row className="text-center p-5 mx-5">
        <Container className="w-75">
          <Col>
            {items.length > 0 ? (
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
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <i
                            className="fa fa-lg fa-trash mx-2 cursor-pointer"
                            onClick={() =>
                              removeFromWishlist(item.wishlistItemId)
                            }
                          />
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
                          <div>In stock: {item.wine.quantity}</div>
                        </td>
                        <td className="align-middle">
                          <Button color="dark">Add to cart</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <h2>Your wishlist is currently empty</h2>
                <p>
                  Please <a href="/browse">click here</a> to wishlist items.
                </p>
              </div>
            )}
          </Col>
        </Container>
      </Row>
    </>
  );
};

export default Wishlist;
