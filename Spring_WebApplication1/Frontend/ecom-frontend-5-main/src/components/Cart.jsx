import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import { Button, Card, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { formatPrice } from "../utils/formatPrice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cart, removeFromCart } = useContext(AppContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImagesAndUpdateCart = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/products");
                const backendProductIds = response.data.map((product) => product.id);

                const updatedCartItems = cart.filter((item) =>
                    backendProductIds.includes(item.id)
                );

                const cartItemsWithImages = await Promise.all(
                    updatedCartItems.map(async (item) => {
                        try {
                            const response = await axios.get(
                                `http://localhost:8080/api/product/${item.id}/image`,
                                { responseType: "blob" }
                            );
                            const imageUrl = URL.createObjectURL(response.data);
                            return { ...item, imageUrl };
                        } catch (error) {
                            console.error("Error fetching image:", error);
                            return { ...item, imageUrl: "placeholder-image-url" };
                        }
                    })
                );

                setCartItems(cartItemsWithImages);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        if (cart.length) {
            fetchImagesAndUpdateCart();
        }
    }, [cart]);

    useEffect(() => {
        const total = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setTotalPrice(total);
    }, [cartItems]);

    const handleIncreaseQuantity = (itemId) => {
        const newCartItems = cartItems.map((item) => {
            if (item.id === itemId) {
                if (item.quantity < item.stockQuantity) {
                    return { ...item, quantity: item.quantity + 1 };
                } else {
                    alert("Cannot add more than available stock");
                }
            }
            return item;
        });
        setCartItems(newCartItems);
    };

    const handleDecreaseQuantity = (itemId) => {
        const newCartItems = cartItems.map((item) =>
            item.id === itemId
                ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
                : item
        );
        setCartItems(newCartItems);
    };

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
        const newCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(newCartItems);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Shopping Bag</h2>
            {cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-cart-x-fill" style={{ fontSize: '3rem', color: '#ccc' }} />
                    <h4>Your cart is empty</h4>
                    <p>Continue shopping to add items to your bag.</p>
                    <Button
                        variant="outline-primary"
                        className="mt-3"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </Button>
                </div>
            ) : (
                <>
                    <Row className="g-4">
                        {cartItems.map((item) => (
                            <Col key={item.id} xs={12} md={6} lg={4}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{ height: "200px", objectFit: "contain" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{item.brand} - {item.name}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <InputGroup style={{ width: "110px" }}>
                                                <Button variant="outline-secondary" onClick={() => handleDecreaseQuantity(item.id)}>-</Button>
                                                <FormControl value={item.quantity} readOnly />
                                                <Button variant="outline-secondary" onClick={() => handleIncreaseQuantity(item.id)}>+</Button>
                                            </InputGroup>
                                            <strong>{formatPrice(item.price * item.quantity)}</strong>
                                        </div>
                                        <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(item.id)}>
                                            <i className="bi bi-trash3-fill"></i> Remove
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-4 p-3 bg-light rounded shadow-sm">
                        <h5>Total: {formatPrice(totalPrice)}</h5>
                        <Button
                            variant="primary"
                            className="w-100 mt-2"
                            onClick={() => navigate("/checkout")}
                        >
                            Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
