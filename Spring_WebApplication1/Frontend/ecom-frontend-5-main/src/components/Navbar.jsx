import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ onSelectCategory }) => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryClick = (category) => {
        onSelectCategory(category.toLowerCase());
        setInput("");
        setShowDropdown(false);
        navigate("/");
    };

    const handleInputChange = (value) => {
        setInput(value);
        clearTimeout(debounceRef.current);

        if (value.trim().length === 0) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/product/search?keyword=${encodeURIComponent(value)}`
                );
                setResults(res.data);
                setNoResults(res.data.length === 0);
                setShowDropdown(true);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
                setNoResults(true);
                setShowDropdown(true);
            }
        }, 300);
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-light shadow-sm sticky-top px-3">
                <div className="container-fluid">
                    <button
                        className="navbar-brand d-flex align-items-center btn btn-link p-0 border-0"
                        onClick={() => handleCategoryClick("")}
                    >
                        <img
                            src="https://1000logos.net/wp-content/uploads/2017/05/Walmart-Logo-768x432.png"
                            alt="Walmart"
                            style={{ height: "35px", marginRight: "10px" }}
                        />
                        <h5 className="mb-0 fw-bold">
                            WALMART <span style={{ color: "#ffc220" }}>Clone</span>
                        </h5>
                    </button>

                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => handleCategoryClick("")}>
                                    Home
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={() => navigate("/add_product")}>
                                    Add Product
                                </button>
                            </li>
                        </ul>

                        {/* Search */}
                        <div className="position-relative" ref={dropdownRef}>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onFocus={() => input && setShowDropdown(true)}
                            />
                            {showDropdown && (
                                <ul
                                    className="list-group position-absolute bg-white border shadow-sm rounded"
                                    style={{
                                        top: "40px",
                                        width: "100%",
                                        zIndex: 1000,
                                        maxHeight: "250px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {results.length > 0 ? (
                                        results.map((item) => (
                                            <li key={item.id} className="list-group-item">
                                                <button
                                                    className="btn btn-link text-start w-100"
                                                    onClick={() => {
                                                        navigate(`/product/${item.id}`);
                                                        setShowDropdown(false);
                                                        setInput("");
                                                    }}
                                                >
                                                    {item.name}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        noResults && (
                                            <li className="list-group-item text-danger">
                                                No product found
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>

                        <button className="btn btn-outline-primary ms-3" onClick={() => navigate("/cart")}>
                            <i className="bi bi-cart-fill"></i> Cart
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
