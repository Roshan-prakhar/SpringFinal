import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/orders").then(res => setOrders(res.data));
    }, []);

    return (
        <div className="container py-4">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No past orders found.</p>
            ) : (
                <ul className="list-group">
                    {orders.map(order => (
                        <li key={order.id} className="list-group-item">
                            <strong>{order.productName}</strong> (Qty: {order.quantity}) - ₹{order.price} <br />
                            <small>{new Date(order.orderTime).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
