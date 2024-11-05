import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        Description: '',
        Price: '',
        StockQuantity: '',
        VendorID: '',
        CategoryID: '',
        ImageURL: '',
        SKU: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const addProduct = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) throw new Error('Failed to add product');

            // Clear the form after a successful addition
            setNewProduct({
                ProductName: '',
                Description: '',
                Price: '',
                StockQuantity: '',
                VendorID: '',
                CategoryID: '',
                ImageURL: '',
                SKU: ''
            });

            // Redirect to the product page
            navigate('/products');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="m-auto bg-white p-4 rounded-lg shadow-md flex-grow w-3/6 ">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { e.preventDefault(); addProduct(); }}
            >
                <input 
                    type="text" 
                    name="ProductName" 
                    placeholder="Product Name" 
                    className="border p-2 rounded"
                    value={newProduct.ProductName} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="Description" 
                    placeholder="Description" 
                    className="border p-2 rounded h-24" // Increased height for description
                    value={newProduct.Description} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="Price" 
                    placeholder="Price" 
                    className="border p-2 rounded" 
                    value={newProduct.Price} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="StockQuantity" 
                    placeholder="Stock Quantity" 
                    className="border p-2 rounded" 
                    value={newProduct.StockQuantity} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="VendorID" 
                    placeholder="Vendor ID" 
                    className="border p-2 rounded" 
                    value={newProduct.VendorID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="CategoryID" 
                    placeholder="Category ID" 
                    className="border p-2 rounded" 
                    value={newProduct.CategoryID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="ImageURL" 
                    placeholder="Image URL" 
                    className="border p-2 rounded" 
                    value={newProduct.ImageURL} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="SKU" 
                    placeholder="SKU" 
                    className="border p-2 rounded" 
                    value={newProduct.SKU} 
                    onChange={handleChange} 
                    required 
                />
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-full m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-3/6"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Create;
