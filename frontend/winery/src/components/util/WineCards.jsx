import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  Col,
  Form,
  Input,
  Row,
} from "reactstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const WineCards = ({ filteredWines }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { username } = auth || {};

  const [cartId, setCartId] = useState();
  const [wishlistId, setWishlistId] = useState();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [buttonTexts, setButtonTexts] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistMap, setWishlistMap] = useState({});

  const fetchData = async () => {
    try {
      const cartsResponse = await axiosPrivate.get(
        `/carts/?customer=${username}`
      );
      const wishlistResponse = await axiosPrivate.get(
        `/wishlists/?customer=${username}`
      );
      setCartId(cartsResponse.data[0].id);
      setWishlistId(wishlistResponse.data[0].id);
      const wishlistItemsData = wishlistResponse.data[0].items;
      const wishlistItemIds = new Set(
        wishlistItemsData.map((item) => item.wine.id)
      );
      const wishlistItemMap = wishlistItemsData.reduce((acc, item) => {
        acc[item.wine.id] = item.id;
        return acc;
      }, {});
      setWishlistItems(wishlistItemIds);
      setWishlistMap(wishlistItemMap);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const addToCart = async (wine) => {
    try {
      const selectedQuantity = selectedQuantities[wine.id] || 1;
      const response = await axiosPrivate.post("/cart-items/", {
        shopping_cart: cartId,
        wine_id: wine.id,
        quantity: selectedQuantity,
      });
      console.log(response.data);
      setButtonTexts({ ...buttonTexts, [wine.id]: "Successfully added!" });
      setButtonDisabled({ ...buttonDisabled, [wine.id]: true });
      setTimeout(() => {
        setButtonTexts({ ...buttonTexts, [wine.id]: "Add to cart" });
        setButtonDisabled({ ...buttonDisabled, [wine.id]: false });
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWishlist = async (wine) => {
    try {
      if (wishlistItems.has(wine.id)) {
        // Remove from wishlist
        const wishlistItemId = wishlistMap[wine.id];
        await axiosPrivate.delete(`/wishlist-items/${wishlistItemId}/`);
        setWishlistItems((prev) => {
          const updated = new Set(prev);
          updated.delete(wine.id);
          return updated;
        });
        setWishlistMap((prev) => {
          const updated = { ...prev };
          delete updated[wine.id];
          return updated;
        });
      } else {
        // Add to wishlist
        const response = await axiosPrivate.post("/wishlist-items/", {
          wishlist: wishlistId,
          wine_id: wine.id,
        });
        console.log(response.data);
        setWishlistItems((prev) => new Set(prev).add(wine.id));
        setWishlistMap((prev) => ({ ...prev, [wine.id]: response.data.id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = (itemId, quantity, maxQuantity) => {
    if (quantity > maxQuantity) {
      quantity = maxQuantity;
    }
    setSelectedQuantities({
      ...selectedQuantities,
      [itemId]: parseInt(quantity) || 1,
    });
  };

  return filteredWines.length > 0 ? (
    filteredWines.map(
      (wine, outerIndex) =>
        outerIndex % 4 === 0 && (
          <Row key={outerIndex}>
            {filteredWines
              .slice(outerIndex, outerIndex + 4)
              .map((wine, innerIndex) => (
                <Col md={3} key={innerIndex} className="p-1">
                  <Card className="mb-2 shadow">
                    <CardImg
                      className="card-img-top"
                      src={wine.image}
                      alt="wine image"
                      loading="eager"
                    />
                    <CardBody>
                      <Row>
                        <Col md={10}>
                          <CardTitle tag="h5">{wine.name}</CardTitle>
                        </Col>
                        <Col md={2}>
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <i
                              className={`fa-heart fa-lg cursor-pointer text-danger ${
                                wishlistItems.has(wine.id) ? "fa" : "fa-regular"
                              }`}
                              onClick={() => toggleWishlist(wine)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <CardSubtitle tag="h6" className="mb-2 text-muted">
                        <b>Type:</b> {wine.type}
                      </CardSubtitle>
                      <div>
                        <p className="mb-1">
                          <b>Sweetness:</b> {wine.sweetness}
                        </p>
                        <p className="mb-1">
                          <b>Age:</b> {wine.age}
                        </p>
                        <p className="mb-1">
                          <b>Winemaker:</b> {wine.winemaker}
                        </p>
                        <hr />
                        <p className="mb-1 text-center lead">
                          <b>{wine.price} RSD</b>
                        </p>
                        <p className="mb-1 text-center">
                          <b>In stock:</b> {wine.quantity}
                        </p>
                        <Row className="mt-3">
                          <Col md={4}>
                            <div className="d-flex justify-content-center align-items-center h-100">
                              <Form>
                                <Input
                                  id={`wine-quantity-${wine.id}`}
                                  type="number"
                                  min="1"
                                  max={wine.quantity}
                                  className="text-center px-1"
                                  value={selectedQuantities[wine.id] || "1"}
                                  onChange={(e) => {
                                    updateQuantity(
                                      wine.id,
                                      e.target.value,
                                      wine.quantity
                                    );
                                  }}
                                />
                              </Form>
                            </div>
                          </Col>
                          <Col md={8}>
                            <div className="text-center my-auto">
                              <Button
                                color="dark"
                                className="w-100"
                                disabled={buttonDisabled[wine.id]}
                                onClick={() => {
                                  addToCart(wine);
                                }}
                              >
                                <small>
                                  {buttonTexts[wine.id] || "Add to cart"}
                                </small>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
          </Row>
        )
    )
  ) : (
    <div className="text-center my-4">
      <h1 className="lead">No wines matching the given criteria found.</h1>
    </div>
  );
};

WineCards.propTypes = {
  filteredWines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      sweetness: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      winemaker: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default WineCards;
