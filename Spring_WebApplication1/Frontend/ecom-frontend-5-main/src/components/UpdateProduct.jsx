import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);

        const responseImage = await axios.get(
            `http://localhost:8080/api/product/${id}/image`,
            { responseType: "blob" }
        );
        const imageFile = await converUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    axios
        .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("Product updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          alert("Failed to update product. Please try again.");
        });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
      <div className="update-product-container" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingTop: "3rem" }}>
        <div className="container bg-white p-4 rounded shadow" style={{ maxWidth: "720px" }}>
          <h2 className="text-primary fw-bold text-center mb-4">Update Product</h2>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label fw-bold">Name</label>
              <input type="text" className="form-control" name="name" value={updateProduct.name} onChange={handleChange} placeholder={product.name} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Brand</label>
              <input type="text" className="form-control" name="brand" value={updateProduct.brand} onChange={handleChange} placeholder={product.brand} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <input type="text" className="form-control" name="description" value={updateProduct.description} onChange={handleChange} placeholder={product.description} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Price</label>
              <input type="number" className="form-control" name="price" value={updateProduct.price} onChange={handleChange} placeholder={product.price} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Category</label>
              <select className="form-select" name="category" value={updateProduct.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="laptop">Laptop</option>
                <option value="headphone">Headphone</option>
                <option value="mobile">Mobile</option>
                <option value="electronics">Electronics</option>
                <option value="toys">Toys</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Stock Quantity</label>
              <input type="number" className="form-control" name="stockQuantity" value={updateProduct.stockQuantity} onChange={handleChange} placeholder={product.stockQuantity} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Product Image</label>
              <div className="mb-2">
                {image && (
                    <img src={URL.createObjectURL(image)} alt="preview" style={{ height: "160px", width: "100%", objectFit: "cover", border: "1px solid #ddd", borderRadius: "4px" }} />
                )}
              </div>
              <input type="file" className="form-control" onChange={handleImageChange} name="image" />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" name="productAvailable" id="gridCheck" checked={updateProduct.productAvailable} onChange={(e) => setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })} />
                <label className="form-check-label fw-bold" htmlFor="gridCheck">Product Available</label>
              </div>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UpdateProduct;
