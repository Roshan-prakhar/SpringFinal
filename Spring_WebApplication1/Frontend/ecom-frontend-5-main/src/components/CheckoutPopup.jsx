import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Your Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You are about to purchase:</p>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>{item.name} × {item.quantity}</li>
                    ))}
                </ul>
                <p><strong>Total: ₹{totalPrice}</strong></p>
                <p><em>This is a dummy payment, no actual transaction will occur.</em></p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleCheckout}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CheckoutPopup;
