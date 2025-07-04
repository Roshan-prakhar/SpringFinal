import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import { formatPrice } from "../utils/formatPrice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "./ChatBot";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = ({ selectedCategory }) => {
    const { data, isError, addToCart, refreshData } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isInitialized) {
            refreshData();
            setIsInitialized(true);
        }
    }, [isInitialized, refreshData]);

    useEffect(() => {
        const fetchImages = async () => {
            const updated = await Promise.all(
                data.map(async (product) => {
                    try {
                        const res = await axios.get(
                            `http://localhost:8080/api/product/${product.id}/image`,
                            { responseType: "blob" }
                        );
                        const imageUrl = URL.createObjectURL(res.data);
                        return { ...product, imageUrl };
                    } catch (err) {
                        console.error("Image fetch failed", err);
                        return { ...product, imageUrl: unplugged };
                    }
                })
            );
            setProducts(updated);
        };

        if (data?.length > 0) fetchImages();
    }, [data]);

    const filteredProducts = selectedCategory
        ? products.filter(
            (p) =>
                p.category &&
                p.category.toLowerCase() === selectedCategory.toLowerCase()
        )
        : products;

    const bannerSettings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: false,
        fade: true, // ✅ fade transition
    };

    if (isError) {
        return (
            <h2 className="text-center" style={{ padding: "18rem" }}>
                <img src={unplugged} alt="Error" style={{ width: "100px" }} />
            </h2>
        );
    }

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={2000} />

            <div
                style={{
                    marginTop: "80px",
                    padding: "30px",
                    backgroundColor: "#f6f6f6",
                    minHeight: "calc(100vh - 140px)",
                }}
            >
                {/* Banner Carousel */}
                {filteredProducts.length > 0 && (
                    <div
                        style={{
                            marginBottom: "30px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        <Slider {...bannerSettings}>
                            {filteredProducts
                                .sort(() => 0.5 - Math.random())
                                .slice(0, 5)
                                .map((product) => (
                                    <div
                                        key={product.id}
                                        style={{
                                            position: "relative",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "300px",
                                                objectFit: "cover",
                                                filter: "brightness(65%)",
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "20px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: "rgba(0, 0, 0, 0.75)",
                                                padding: "16px 28px",
                                                borderRadius: "10px",
                                                color: "#fff",
                                                fontSize: "1.4rem",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                textTransform: "uppercase",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                                                maxWidth: "90%",
                                            }}
                                        >
                                            {product.name} | {formatPrice(product.price)}
                                            <br />
                                            <button
                                                style={{
                                                    marginTop: "12px",
                                                    backgroundColor: "#00a650",
                                                    border: "none",
                                                    padding: "10px 20px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.95rem",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate(`/product/${product.id}`)
                                                }
                                            >
                                                Shop Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </Slider>
                    </div>
                )}

                {/* Product Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {filteredProducts.length === 0 ? (
                        <h2 className="text-center">No Products Available</h2>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: "100%",
                                            height: "180px",
                                            objectFit: "cover",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    />
                                    <div style={{ padding: "16px" }}>
                                        <h5
                                            style={{
                                                fontSize: "1.1rem",
                                                fontWeight: "bold",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            {product.name.toUpperCase()}
                                        </h5>
                                        <p style={{ fontSize: "0.85rem", color: "#555" }}>
                                            ~ {product.brand}
                                        </p>
                                        <h5
                                            style={{
                                                color: "#222",
                                                fontWeight: "600",
                                                margin: "12px 0 0 0",
                                            }}
                                        >
                                            {formatPrice(product.price)}
                                        </h5>
                                    </div>
                                </Link>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "12px 16px",
                                        gap: "10px",
                                        borderTop: "1px solid #eee",
                                    }}
                                >
                                    <button
                                        style={{
                                            backgroundColor: "#0071dc",
                                            color: "#fff",
                                            border: "none",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            flex: 1,
                                            cursor: product.productAvailable
                                                ? "pointer"
                                                : "not-allowed",
                                        }}
                                        disabled={!product.productAvailable}
                                        onClick={() => {
                                            addToCart({ ...product, quantity: 1 });
                                            toast.success(`${product.name} added to cart`);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: "#00a650",
                                            color: "#fff",
                                            border: "none",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            flex: 1,
                                            cursor: product.productAvailable
                                                ? "pointer"
                                                : "not-allowed",
                                        }}
                                        disabled={!product.productAvailable}
                                        onClick={() => {
                                            addToCart({ ...product, quantity: 1 });
                                            navigate("/cart");
                                        }}
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer
                style={{
                    width: "100%",
                    backgroundColor: "#0071dc",
                    color: "#fff",
                    padding: "15px 0",
                    textAlign: "center",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    marginTop: "2rem",
                }}
            >
                &copy; 2025 <span style={{ fontWeight: 700 }}>Walmart</span> Clone. All rights reserved.
            </footer>
            <ChatBot />
        </>
    );
};

export default Home;
