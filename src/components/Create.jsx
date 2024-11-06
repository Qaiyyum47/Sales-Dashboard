import React, { useState } from 'react';

const Create = ({ onClose }) => {
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
        const productToSubmit = { ...newProduct };

        // Remove fields with null, undefined, or empty values
        for (let key in productToSubmit) {
            if (productToSubmit[key] === null || productToSubmit[key] === '' || productToSubmit[key] === undefined) {
                delete productToSubmit[key]; // Don't send null or empty values
            }
        }

        console.log("Submitting Product Data:", productToSubmit); // Log cleaned data before submission

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSubmit)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to add product:', errorData);
                throw new Error('Failed to add product');
            }

            // Reset the form after successful submission
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

            // Close modal and reload the page
            onClose();
            window.location.reload(); // Page will reload here
        } catch (error) {
            console.error('Error in addProduct:', error.message);
        }
    };

    return (
        <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-96 h-auto border-gray-300 border">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    console.log('Form Submitted with:', newProduct); // Log form data when submitted
                    addProduct(); 
                }}
            >
                <input 
                    type="text" 
                    name="ProductName" 
                    placeholder="Product Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newProduct.ProductName} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="Description" 
                    placeholder="Description" 
                    className="border p-2 rounded-lg shadow-sm h-24 focus:border-gray-800" 
                    value={newProduct.Description} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="Price" 
                    placeholder="Price" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.Price} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="StockQuantity" 
                    placeholder="Stock Quantity" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.StockQuantity} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="VendorID" 
                    placeholder="Vendor ID" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.VendorID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="CategoryID" 
                    placeholder="Category ID" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.CategoryID} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="ImageURL" 
                    placeholder="Image URL" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.ImageURL} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="SKU" 
                    placeholder="SKU" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.SKU} 
                    onChange={handleChange} 
                    required 
                />
                <button 
                    type="submit" 
                    className="bg-gray-800 rounded-lg m-auto hover:bg-gray-700 text-white py-2 px-4 border shadow transition w-full"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default Create;