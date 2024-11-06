import React, { useState, useEffect } from 'react';

const EditProduct = ({ product, onClose }) => {
    
    // Initialize state for product details
    const [updatedProduct, setUpdatedProduct] = useState({
        ProductName: '',
        Description: '',
        Price: 0,
        StockQuantity: 0,
        VendorID: 0,
        CategoryID: 0,
        ImageURL: '',
        SKU: ''
    });

    // Set default product data if product is passed as prop
    useEffect(() => {
        if (product) {
            setUpdatedProduct({
                ProductName: product.ProductName || '',
                Description: product.Description || '',
                Price: product.Price || 0,
                StockQuantity: product.StockQuantity || 0,
                VendorID: product.VendorID || 0,
                CategoryID: product.CategoryID || 0,
                ImageURL: product.ImageURL || '',
                SKU: product.SKU || ''
            });
        }
    }, [product]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const saveProduct = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.ProductID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update product:', errorData);
                alert('Failed to update product. Please try again.');
                return;
            }
    
            // Close modal and reload the page
            onClose();
            window.location.reload(); // Page will reload here
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-96 h-auto border-gray-300 border">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { e.preventDefault(); saveProduct(); }}
            >
                <input 
                    type="text" 
                    name="ProductName" 
                    placeholder="Product Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={updatedProduct.ProductName} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="Description" 
                    placeholder="Description" 
                    className="border p-2 rounded-lg shadow-sm h-24 focus:border-gray-800" 
                    value={updatedProduct.Description} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="Price" 
                    placeholder="Price" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.Price} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="StockQuantity" 
                    placeholder="Stock Quantity" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.StockQuantity} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="VendorID" 
                    placeholder="Vendor ID" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.VendorID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="CategoryID" 
                    placeholder="Category ID" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.CategoryID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="ImageURL" 
                    placeholder="Image URL" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.ImageURL} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="SKU" 
                    placeholder="SKU" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={updatedProduct.SKU} 
                    onChange={handleChange} 
                    required 
                />
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-lg m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-full"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProduct;