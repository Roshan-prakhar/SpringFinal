import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ComparePopup = ({ show, handleClose, items }) => {
    if (!items) return null;

    return (
        <Modal size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Smarty ⚡ Compare</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {items.length === 0 ? (
                    <p className="text-center text-danger">No similar products found for comparison.</p>
                ) : (
                    <div className="table-responsive">
                        <Table bordered hover className="text-center align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>Feature</th>
                                {items.map((p) => (
                                    <th key={p.id}>{p.name}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Brand</td>
                                {items.map((p) => (
                                    <td key={`brand-${p.id}`}>{p.brand}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Description</td>
                                {items.map((p) => (
                                    <td key={`desc-${p.id}`}>
                                        {p.description.length > 120
                                            ? p.description.slice(0, 120) + "..."
                                            : p.description}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Price</td>
                                {items.map((p) => (
                                    <td key={`price-${p.id}`}>₹{p.price}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Stock</td>
                                {items.map((p) => (
                                    <td key={`stock-${p.id}`}>{p.stockQuantity}</td>
                                ))}
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ComparePopup;
