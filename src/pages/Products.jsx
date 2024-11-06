import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/Modal';
import Create from '../components/Create';
import Remove from '../components/Remove'; // Import Remove component
import EditProduct from '../components/EditProduct';

const Products = () => {
    // State definitions
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // Separate state for Add Product modal
    const [isRemoveProductModalOpen, setIsRemoveProductModalOpen] = useState(false); // Separate state for Remove Product modal
    const [productToRemove, setProductToRemove] = useState(null); // Store product for removal
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [inventoryData, setInventoryData] = useState([
        { category: "Laptops", stock: 120 },
        { category: "Desktops", stock: 80 },
        { category: "Accessories", stock: 50 },
        { category: "Components", stock: 150 },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("Fetching products..."); // Check when the fetch starts
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                console.log("Fetched products:", data); // Log fetched data
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.message);
            }
        };
        fetchProducts();
    }, []);
    

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const searchInStringFields = product.ProductName && product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
        const searchInNumberFields = 
            product.Price.toString().includes(searchTerm) ||
            product.StockQuantity.toString().includes(searchTerm) ||
            product.VendorID.toString().includes(searchTerm) ||
            product.CategoryID.toString().includes(searchTerm);
        
        return searchInStringFields || searchInNumberFields;
    });

    // Handle remove action
    const handleRemove = async (productId) => {
        setProductToRemove(productId); // Set the product to be deleted
        setIsRemoveProductModalOpen(true); // Open the Remove Product modal
    };

    //Handle edit action
    const handleEdit = (productId) => {
        const product = products.find(p => p.ProductID === productId);
        setSelectedProduct(product);
        setIsEditProductModalOpen(true); // Ensure this is set to true
    };

    const handleSave = async (updatedProduct) => {
        try {
            // Send the update request to the server
            const response = await fetch(`http://localhost:5000/api/products/${updatedProduct.ProductID}`, {
                method: 'PUT',
                body: JSON.stringify(updatedProduct),
                headers: { 'Content-Type': 'application/json' },
            });
    
            // If the response is not okay, throw an error
            if (!response.ok) throw new Error('Failed to update product');
    
            // Parse the response data
            const data = await response.json();
    
            // Update the products state with the updated product data
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.ProductID === updatedProduct.ProductID ? { ...product, ...data } : product
                )
            );
    
            // Optionally close the modal after saving
            setIsEditProductModalOpen(false);
    
        } catch (error) {
            console.error('Error saving product:', error);
            alert('There was an error updating the product. Please try again.');
        }
    };
    
    

    // Confirm product removal
    const confirmRemove = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productToRemove}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts(products.filter(product => product.ProductID !== productToRemove));
            setIsRemoveProductModalOpen(false); // Close the Remove Product modal after successful deletion
        } catch (error) {
            console.error('Error removing product:', error);
            setError(error.message);
            setIsRemoveProductModalOpen(false); // Close the Remove Product modal even on error
        }
    };


    return (
        <div className="overflow-x-auto p-5">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="mt-4 flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">All Products</h1>
                <div className="flex items-center space-x-2">
                    <div>
                        <button
                            onClick={() => setIsAddProductModalOpen(true)} // Open Add Product modal
                            className="mr-4 bg-gray-800 rounded-full hover:bg-gray-700 text-white py-2 px-4 border shadow transition"
                        >
                            Add Product
                        </button>
                        <Modal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)}>
                            <Create onClose={() => setIsAddProductModalOpen(false)} />
                        </Modal>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="border rounded-full pl-10 pr-4 py-2 w-full md:w-64" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>

            <table className="shadow-md min-w-full table-fixed border-collapse rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">No.</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-2/12">Name</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">Price</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">Stock</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">SKU</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">Category ID</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">Date Added</th>
                        <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <tr key={product.ProductID} className="hover:bg-gray-100 transition-all duration-200">
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{product.ProductName}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{product.Price}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{product.StockQuantity}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{product.SKU}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{product.CategoryID}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{new Date(product.DateAdded).toLocaleDateString()}</td>
                                <td className="py-4 px-4 border-b border-gray-300 text-gray-800 space-x-4">
                                    <button onClick={() => handleEdit(product.ProductID)} className="text-blue-500 hover:underline">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleRemove(product.ProductID)} className="text-red-500 hover:underline">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4 text-gray-800">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {error && <div className="text-red-500 mt-4">{error}</div>}

            {/* Remove modal component */}
            {isRemoveProductModalOpen && (
                <Remove 
                    onClose={() => setIsRemoveProductModalOpen(false)} 
                    onConfirm={confirmRemove} 
                    productName={products.find(p => p.ProductID === productToRemove)?.ProductName}
                />
            )}

{isEditProductModalOpen && selectedProduct && (
    <Modal isOpen={isEditProductModalOpen} onClose={() => setIsEditProductModalOpen(false)}>
        <EditProduct 
            product={selectedProduct} 
            onClose={() => setIsEditProductModalOpen(false)} 
            onSave={handleSave} // Ensure onSave is correctly mapped in EditProduct
        />
    </Modal>
)}



             {/* Container for Analytics and List Card */}
             <div className="flex flex-grow mt-6 gap-4">
                
                <div className="bg-white p-4 rounded-lg shadow-md w-2/5 h-100">
                    <h2 className="text-xl font-semibold mb-3">Popular Product</h2>
                    <p className="mb-6">Current trending product in shop.</p>
                </div>

                {/* Analytics Square */}
                <div className="bg-white p-4 rounded-lg shadow-md flex-grow h-5/6">
                    <h2 className="text-xl font-semibold mb-3">Inventory</h2>
                    <p className="mb-6">Current stock levels across all categories.</p>
                    <ResponsiveContainer width="95%" height={300}>
                        <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="stock" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
            </div>
        </div>
    );
};

export default Products;
