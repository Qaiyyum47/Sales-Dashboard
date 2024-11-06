import React, { useState, useEffect } from 'react';

const Create = ({ onClose }) => {
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        Description: '',
        Price: '',
        StockQuantity: '',
        VendorID: '',
        CategoryID: '',  // Will store CategoryID selected from dropdown
        ImageURL: '',
        SKU: '',
        ProductDate: new Date().toISOString().substring(0, 10) // Default to today’s date
    });


    // Initialize the categories for the dropdown
    const [categories, setCategories] = useState([
        { CategoryID: 1, CategoryName: "Laptops" },
        { CategoryID: 2, CategoryName: "Desktops" },
        { CategoryID: 4, CategoryName: "Components" },
        { CategoryID: 3, CategoryName: "Accessories" },
        { CategoryID: 5, CategoryName: "Monitors" }
    ]);
    //Test
    
    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories');  // Adjust endpoint as necessary
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const addProduct = async () => {
        // Filter out empty fields before submitting
        const productToSubmit = { ...newProduct };
        for (let key in productToSubmit) {
            if (!productToSubmit[key]) delete productToSubmit[key];
        }

        console.log("Submitting Product Data:", productToSubmit);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSubmit)
            });

            if (!response.ok) throw new Error('Failed to add product');

            // Reset form fields after successful submission
            setNewProduct({
                ProductName: '',
                Description: '',
                Price: '',
                StockQuantity: '',
                VendorID: '',
                CategoryID: '',
                ImageURL: '',
                SKU: '',
                ProductDate: new Date().toISOString().substring(0, 10)
            });

            onClose(); // Close modal
            window.location.reload(); // Reload page to reflect new product
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
                    addProduct(); 
                }}
            >
                {/* Product Name */}
                <input 
                    type="text" 
                    name="ProductName" 
                    placeholder="Product Name" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    value={newProduct.ProductName} 
                    onChange={handleChange} 
                    required 
                />

                {/* Description */}
                <textarea 
                    name="Description" 
                    placeholder="Description" 
                    className="border p-2 rounded-lg shadow-sm h-24 focus:border-gray-800" 
                    value={newProduct.Description} 
                    onChange={handleChange} 
                    required 
                />

                {/* Price */}
                <input 
                    type="number" 
                    name="Price" 
                    placeholder="Price" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.Price} 
                    onChange={handleChange} 
                    required 
                />

                {/* Stock Quantity */}
                <input 
                    type="number" 
                    name="StockQuantity" 
                    placeholder="Stock Quantity" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.StockQuantity} 
                    onChange={handleChange} 
                    required 
                />

                {/* Vendor ID */}
                <input 
                    type="number" 
                    name="VendorID" 
                    placeholder="Vendor ID" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.VendorID} 
                    onChange={handleChange} 
                    required 
                />

                {/* Category Dropdown */}
                <select 
                    name="CategoryID" 
                    value={newProduct.CategoryID} 
                    onChange={handleChange} 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.CategoryID} value={category.CategoryID}>
                            {category.CategoryName}
                        </option>
                    ))}
                </select>

                {/* Image URL */}
                <input 
                    type="text" 
                    name="ImageURL" 
                    placeholder="Image URL" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.ImageURL} 
                    onChange={handleChange} 
                    required 
                />

                {/* SKU */}
                <input 
                    type="text" 
                    name="SKU" 
                    placeholder="SKU" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.SKU} 
                    onChange={handleChange} 
                    required 
                />

                {/* Date Added */}
                <input 
                    type="date" 
                    name="ProductDate" 
                    className="border p-2 rounded-lg shadow-sm focus:border-gray-800" 
                    value={newProduct.ProductDate} 
                    onChange={handleChange} 
                    required 
                />

                {/* Submit Button */}
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
