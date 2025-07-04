import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";


const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
    });
    const [image, setImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("imageFile", image);
        formData.append(
            "product",
            new Blob([JSON.stringify(product)], { type: "application/json" })
        );

        axios
            .post("http://localhost:8080/api/product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                console.log("Product added successfully:", response.data);
                alert("✅ Product added successfully");
            })
            .catch((error) => {
                console.error("Error adding product:", error);
                alert("❌ Error adding product");
            });
    };

    return (
        <div className="container py-5">
            <div className="card shadow p-4 mx-auto" style={{ maxWidth: "800px" }}>
                <h3 className="mb-4 text-center fw-bold">Add New Product</h3>
                <form className="row g-4" onSubmit={submitHandler}>
                    <div className="col-md-6">
                        <label className="form-label">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter product name"
                            value={product.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control"
                            placeholder="Brand name"
                            value={product.brand}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="Write a short description"
                            rows="3"
                            value={product.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            placeholder="Eg: 1000"
                            value={product.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Stock Quantity</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            className="form-control"
                            placeholder="Available stock"
                            value={product.stockQuantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Release Date</label>
                        <input
                            type="date"
                            name="releaseDate"
                            className="form-control"
                            value={product.releaseDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-select"
                            value={product.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Headphone">Headphone</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Toys">Toys</option>
                            <option value="Fashion">Fashion</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Product Image</label>
                        <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    <div className="col-md-12">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                name="productAvailable"
                                className="form-check-input"
                                id="availabilityCheck"
                                checked={product.productAvailable}
                                onChange={(e) =>
                                    setProduct({ ...product, productAvailable: e.target.checked })
                                }
                            />
                            <label className="form-check-label" htmlFor="availabilityCheck">
                                Product Available
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-success px-4">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
