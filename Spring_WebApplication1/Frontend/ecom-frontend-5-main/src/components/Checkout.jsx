import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import { formatPrice } from "../utils/formatPrice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
    const { cart, clearCart } = useContext(AppContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [upiId, setUpiId] = useState("");
    const [isPaying, setIsPaying] = useState(false);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const handlePayment = () => {
        const card = cardNumber.replace(/\s+/g, "");
        const upi = upiId.trim();

        if (paymentMethod === "card" && card !== "1234567890123456") {
            toast.error("❌ Invalid Card Number. Use: 1234 5678 9012 3456");
            return;
        }

        if (paymentMethod === "upi" && upi !== "test@upi") {
            toast.error("❌ Invalid UPI ID. Use: test@upi");
            return;
        }

        setIsPaying(true);

        setTimeout(() => {
            toast.success("✅ Payment Successful");

            setTimeout(() => {
                clearCart();
                navigate("/cart"); // Redirect to cart page
            }, 1500);
        }, 1000);
    };

    return (
        <div style={{
            padding: "2rem",
            maxWidth: "600px",
            margin: "auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fefefe",
            boxShadow: "0 0 10px rgba(0,0,0,0.08)"
        }}>
            <ToastContainer position="top-center" autoClose={2000} />
            <h2 className="mb-3 text-center">Checkout</h2>

            {/* Payment Method */}
            <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: 600 }}>Select Payment Method</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginTop: "0.5rem"
                    }}
                >
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                </select>
            </div>

            {paymentMethod === "card" && (
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Card Number</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            marginTop: "0.5rem"
                        }}
                    />
                </div>
            )}

            {paymentMethod === "upi" && (
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>UPI ID</label>
                    <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="test@upi"
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            marginTop: "0.5rem"
                        }}
                    />
                </div>
            )}

            {/* Billing Summary */}
            <div style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
                marginBottom: "1rem"
            }}>
                <h5 style={{ marginBottom: "10px" }}>Billing Summary</h5>
                <div className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <span>GST (18%):</span>
                    <span>{formatPrice(gst)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between font-weight-bold">
                    <strong>Total Payable:</strong>
                    <strong>{formatPrice(total)}</strong>
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={isPaying}
                style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isPaying ? "not-allowed" : "pointer"
                }}
            >
                {isPaying ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
            </button>
        </div>
    );
};

export default Checkout;
