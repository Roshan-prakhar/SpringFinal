// Enhanced Product.jsx with Price Trend Analysis
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "axios";
import { Button, Modal, Table } from "react-bootstrap";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, removeFromCart, refreshData, data } = useContext(AppContext);

    const [product, setProduct] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [compareItems, setCompareItems] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [sameCategoryProducts, setSameCategoryProducts] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/product/${id}`);
                setProduct(res.data);

                if (res.data.imageName) {
                    const imgRes = await axios.get(
                        `http://localhost:8080/api/product/${id}/image`,
                        { responseType: "blob" }
                    );
                    setImageUrl(URL.createObjectURL(imgRes.data));
                }
            } catch (err) {
                console.error("Error loading product:", err);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchPriceTrend = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/product/${id}/price-trend`);
                setPriceTrend(res.data.trend || []);
                setTrendSummary(res.data.summary || "");
            } catch (err) {
                console.error("Error loading price trend:", err);
            }
        };

        if (product) fetchPriceTrend();
    }, [product, id]);

    useEffect(() => {
        const fetchImages = async () => {
            if (!product || !data?.length) return;

            const filtered = data.filter(
                (p) => p.id !== product.id && p.category === product.category
            );

            const updated = await Promise.all(
                filtered.map(async (p) => {
                    try {
                        const res = await axios.get(
                            `http://localhost:8080/api/product/${p.id}/image`,
                            { responseType: "blob" }
                        );
                        return { ...p, imageUrl: URL.createObjectURL(res.data) };
                    } catch {
                        return { ...p, imageUrl: "" };
                    }
                })
            );
            setSameCategoryProducts(updated);
        };

        fetchImages();
    }, [product, data]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: 1 });
        alert(`${product.name} added to cart`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/product/${id}`);
            removeFromCart(id);
            refreshData();
            alert("Product deleted");
            navigate("/");
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleSmartCompare = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/product/${id}/compare`);
            setCompareItems(res.data || []);
        } catch {
            setCompareItems([]);
        }
        setShowCompare(true);
    };

    const handleUpdate = () => navigate(`/product/update/${id}`);

    if (!product) return <h2 style={{ textAlign: "center", padding: "4rem" }}>Loading...</h2>;

    return (
        <div style={{ padding: "1rem", backgroundColor: "#f4f6f8", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 6px 16px rgba(0,0,0,0.05)", padding: "1.25rem" }}>
                <div style={{ flex: 1, minWidth: "260px", textAlign: "center" }}>
                    <img src={imageUrl} alt={product.name} style={{ width: "100%", maxWidth: "300px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} />
                </div>
                <div style={{ flex: 2, minWidth: "260px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{product.name}</h2>
                    <p style={{ color: "#666", marginBottom: "0.4rem" }}><i>Brand: {product.brand}</i></p>
                    <p style={{ color: "#444" }}>{product.description}</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0071dc" }}>₹ {product.price}</p>
                    <p><span className={`badge ${product.productAvailable ? 'bg-success' : 'bg-danger'}`}>{product.productAvailable ? 'In Stock' : 'Out of Stock'}</span></p>
                    <p>Category: <b>{product.category}</b></p>

                    <div style={{ backgroundColor: "#f8f9fa", border: "1px solid #ddd", padding: "0.75rem", margin: "1rem 0", borderRadius: "8px" }}>
                        <h5 style={{ marginBottom: "0.5rem" }}>🚚 Delivery Info</h5>
                        <p style={{ margin: 0, color: "green" }}>✔ Same Day with <b style={{ color: "#0071dc" }}>PLUS</b></p>
                        <p style={{ margin: 0 }}>📦 Standard: <b>7 days</b></p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <button onClick={handleAddToCart} disabled={!product.productAvailable} style={{ padding: "10px", backgroundColor: product.productAvailable ? "#0071dc" : "#ccc", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600" }}>🛒 Add to Cart</button>
                        <button onClick={() => { addToCart({ ...product, quantity: 1 }); setShowCheckout(true); }} disabled={!product.productAvailable} style={{ padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600" }}>💰 Buy Now</button>
                        <button onClick={handleSmartCompare} style={{ padding: "10px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "6px", fontWeight: "600" }}>💡 SMARTY COMPARE</button>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <button onClick={handleUpdate} style={{ flex: 1, padding: "8px", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px" }}>Update</button>
                        <button onClick={handleDelete} style={{ flex: 1, padding: "8px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}>Delete</button>
                    </div>
                </div>
            </div>
            {/* Additional sections remain unchanged */}
            {/* Price Trend */}
            <div style={{ marginTop: "1.5rem" }}>
                <h4>📊 Price Trend (7 Days)</h4>
                <div style={{
                    backgroundColor: "#fff",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    fontSize: "0.85rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}>
                    <Table bordered hover size="sm">
                        <thead className="table-light">
                        <tr><th>Date</th><th>Price (₹)</th></tr>
                        </thead>
                        <tbody>
                        {[0, 1, 2, 3, 4, 5, 6].map((d, i) => {
                            const base = product.price;
                            const trend = [0, 300, 100, -200, -150, 50, -100][i];
                            const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
                            return <tr key={i}><td>{date}</td><td>₹{base + trend}</td></tr>;
                        })}
                        </tbody>
                    </Table>
                    <p style={{ color: "#28a745", fontWeight: "bold", marginTop: "0.5rem" }}>
                        {(() => {
                            const prices = [product.price, product.price + 300, product.price + 100, product.price - 200, product.price - 150, product.price + 50, product.price - 100];
                            const min = Math.min(...prices);
                            const max = Math.max(...prices);
                            if (product.price === min) return "📉 Lowest price in 7 days!";
                            if (product.price === max) return "📈 Highest price in 7 days.";
                            return "↕ Fluctuating trend observed.";
                        })()}
                    </p>
                </div>
            </div>

            {/* Reviews */}
            <div style={{ marginTop: "1.5rem" }}>
                <h4>User Reviews</h4>
                <div style={{
                    backgroundColor: "#fff",
                    padding: "0.75rem",
                    fontSize: "0.85rem",
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                }}>
                    <p><strong>User 1:</strong> ⭐⭐⭐⭐⭐ Great value for the price!</p>
                    <p><strong>User 2:</strong> ⭐⭐⭐⭐ Solid build, decent delivery speed.</p>
                    <p><strong>User 3:</strong> ⭐⭐ Expected better performance.</p>
                </div>
            </div>

            {/* Related */}
            {sameCategoryProducts.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <h4>More in "{product.category}"</h4>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: "0.75rem"
                    }}>
                        {sameCategoryProducts.map((p) => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                borderRadius: "6px",
                                padding: "0.5rem",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                            }}>
                                <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "110px", objectFit: "cover", borderRadius: "4px" }} />
                                <div style={{ marginTop: "0.4rem", fontSize: "0.85rem" }}>
                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                    <div style={{ color: "#0071dc", fontWeight: "bold" }}>₹ {p.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Compare Modal */}
            <Modal size="lg" show={showCompare} onHide={() => setShowCompare(false)}>
                <Modal.Header closeButton><Modal.Title>Smarty ⚡ Compare</Modal.Title></Modal.Header>
                <Modal.Body>
                    {compareItems.length === 0 ? (
                        <p className="text-danger text-center">No similar products found.</p>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover className="text-center align-middle" size="sm">
                                <thead className="table-light">
                                <tr>
                                    <th>Feature</th>
                                    <th>Selected</th>
                                    {compareItems.map(p => <th key={p.id}>{p.name}</th>)}
                                </tr>
                                </thead>
                                <tbody>
                                <tr><td>Brand</td><td>{product.brand}</td>{compareItems.map(p => <td key={p.id}>{p.brand}</td>)}</tr>
                                <tr><td>Description</td><td>{product.description}</td>{compareItems.map(p => <td key={p.id}>{p.description.slice(0, 50)}...</td>)}</tr>
                                <tr><td>Price</td><td>₹{product.price}</td>{compareItems.map(p => <td key={p.id}>₹{p.price}</td>)}</tr>
                                <tr><td>Stock</td><td>{product.stockQuantity}</td>{compareItems.map(p => <td key={p.id}>{p.stockQuantity}</td>)}</tr>
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCompare(false)} size="sm">Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Checkout Modal */}
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)} centered>
                <Modal.Header closeButton><Modal.Title>Confirm Purchase</Modal.Title></Modal.Header>
                <Modal.Body>Proceed to checkout with <strong>{product.name}</strong> for ₹{product.price}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckout(false)} size="sm">Cancel</Button>
                    <Button variant="success" onClick={() => navigate("/cart")} size="sm">Go to Checkout</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Product;
