import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Modal from "../components/Modal";
import Create from "../components/Create";
import Remove from "../components/Remove"; // Import Remove component
import EditProduct from "../components/EditProduct";

const Products = () => {
  // State definitions
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // Separate state for Add Product modal
  const [isRemoveProductModalOpen, setIsRemoveProductModalOpen] =
    useState(false); // Separate state for Remove Product modal
  const [productToRemove, setProductToRemove] = useState(null); // Store product for removal
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [vendorInventoryData, setVendorInventoryData] = useState([]);
  const [productInventoryData, setProductInventoryData] = useState([]);
  const [productInventoryData1, setProductInventoryData1] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products with pagination parameters
        const response = await fetch(
          `http://localhost:5000/api/products?page=${currentPage}&size=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        console.log("Fetched Data:", data); // Log the fetched data for debugging

        // Handle product data
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error("Products data is not in expected format");
        }

        // Handle inventory data
        if (Array.isArray(data.inventory)) {
          setProductInventoryData(data.inventory);
        } else {
          throw new Error("Inventory data is not in expected format");
        }

        // Set total pages for pagination
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Total pages data is missing");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize]); // Re-fetch data when currentPage or pageSize changes

  // Pagination handlers
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle page size change and reset to the first page
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and inventory data from the backend
        const response = await fetch("http://localhost:5000/api/inventory");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        console.log("Fetched Data:", data); // Log the fetched data for debugging

        // Make sure the data is in the expected format
        if (Array.isArray(data.products)) {
          setProducts(data.products); // Store detailed product data
        } else {
          throw new Error("Products data is not in expected format");
        }

        // Store inventory data (total stock per category)
        if (Array.isArray(data.inventory)) {
          setProductInventoryData1(data.inventory);
        } else {
          throw new Error("Inventory data is not in expected format");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchInStringFields =
      product.ProductName &&
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
    const searchInNumberFields =
      product.Price.toString().includes(searchTerm) ||
      product.StockQuantity.toString().includes(searchTerm) ||
      product.VendorID.toString().includes(searchTerm) ||
      product.CategoryID.toString().includes(searchTerm);

    return searchInStringFields || searchInNumberFields;
  });

  // Handle remove action
  const handleRemove = async (productId) => {
    console.log("Handling remove for product ID:", productId); // Log when remove action is triggered
    setProductToRemove(productId); // Set the product to be deleted
    setIsRemoveProductModalOpen(true); // Open the Remove Product modal
  };

  // Handle edit action
  const handleEdit = (productId) => {
    console.log("Handling edit for product ID:", productId); // Log when edit action is triggered
    const product = products.find((p) => p.ProductID === productId);
    setSelectedProduct(product);
    setIsEditProductModalOpen(true); // Ensure this is set to true
  };

  const handleSave = async (updatedProduct) => {
    try {
      console.log("Saving updated product:", updatedProduct); // Log before saving
      // Only update the DateAdded if it's a new value (optional logic)
      let updatedDate = updatedProduct.DateAdded;
      if (updatedDate && !isNaN(new Date(updatedDate).getTime())) {
        updatedDate = new Date(updatedDate).toISOString().slice(0, 10); // Format if valid
        console.log("Valid Date Added:", updatedDate); // Log formatted DateAdded
      } else {
        updatedDate = new Date().toISOString().slice(0, 10); // Default to current date if invalid
        console.log("Default Date Added:", updatedDate); // Log default DateAdded
      }

      const productToSave = { ...updatedProduct, DateAdded: updatedDate };

      console.log("Product to save:", productToSave); // Log the full product object to be saved

      // Send the update request to the server
      const response = await fetch(
        `http://localhost:5000/api/products/${productToSave.ProductID}`,
        {
          method: "PUT",
          body: JSON.stringify(productToSave),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      const data = await response.json();
      console.log("Updated product response:", data); // Log the response data from the server

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.ProductID === productToSave.ProductID
            ? { ...product, ...data }
            : product
        )
      );

      setIsEditProductModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error); // Log save error
      alert("There was an error updating the product. Please try again.");
    }
  };

  // Confirm product removal
  const confirmRemove = async () => {
    console.log("Confirming removal of product ID:", productToRemove); // Log before removal
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productToRemove}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(
        products.filter((product) => product.ProductID !== productToRemove)
      );
      setIsRemoveProductModalOpen(false); // Close the Remove Product modal after successful deletion
    } catch (error) {
      console.error("Error removing product:", error); // Log remove error
      setError(error.message);
      setIsRemoveProductModalOpen(false); // Close the Remove Product modal even on error
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vendors");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setVendors(data);

        // Group vendors by name and sum their total stock quantity
        const groupedData = data.reduce((acc, vendor) => {
          const vendorName = vendor.VendorName;
          const totalStock = vendor.TotalStock;

          if (acc[vendorName]) {
            acc[vendorName] += totalStock;
          } else {
            acc[vendorName] = totalStock;
          }

          return acc;
        }, {});

        const formattedData = Object.keys(groupedData).map((vendor) => ({
          vendor,
          totalStock: groupedData[vendor],
        }));

        setVendorInventoryData(formattedData); // Set data for the chart
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setError(error.message);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="overflow-x-auto p-5">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <div className="mt-1 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex items-center space-x-2">
          <div>
            <button
              onClick={() => setIsAddProductModalOpen(true)} // Open Add Product modal
              className="mr-4 bg-gray-800 rounded-full hover:bg-gray-700 text-white py-2 px-4 border shadow transition"
            >
              Add Product
            </button>
            <Modal
              isOpen={isAddProductModalOpen}
              onClose={() => setIsAddProductModalOpen(false)}
            >
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
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              No.
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-2/12">
              Name
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Price
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Stock
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              SKU
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Category ID
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Date Added
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr
                key={product.ProductID}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {index + 1}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {product.ProductName}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {product.Price}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {product.StockQuantity}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {product.SKU}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {product.CategoryName}
                </td>{" "}
                {/* Here is the change */}
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {new Date(product.DateAdded).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800 space-x-4">
                  <button
                    onClick={() => handleEdit(product.ProductID)}
                    className="text-blue-500 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleRemove(product.ProductID)}
                    className="text-red-500 hover:underline"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-800">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-700 text-white py-2 px-4 rounded-lg border shadow transition hover:bg-gray-800"
        >
          Prev
        </button>
        <span className="text-gray-800">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg border shadow transition hover:bg-gray-700"
        >
          Next
        </button>
      </div>
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}

      {/* Remove modal component */}
      {isRemoveProductModalOpen && (
        <Remove
          onClose={() => setIsRemoveProductModalOpen(false)}
          onConfirm={confirmRemove}
          productName={
            products.find((p) => p.ProductID === productToRemove)?.ProductName
          }
        />
      )}

      {isEditProductModalOpen && selectedProduct && (
        <Modal
          isOpen={isEditProductModalOpen}
          onClose={() => setIsEditProductModalOpen(false)}
        >
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
          <h2 className="text-xl font-semibold mb-3">Vendor Inventory</h2>
          <p className="mb-6">Total stock levels across all vendors.</p>
          <ResponsiveContainer width="95%" height={300}>
            <BarChart
              data={vendorInventoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" /> {/* Displaying vendor names */}
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalStock" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytics Square */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-grow h-5/6">
          <h2 className="text-xl font-semibold mb-3">Inventory</h2>
          <p className="mb-6">Current stock levels across all categories.</p>
          <ResponsiveContainer width="95%" height={300}>
            <BarChart
              data={productInventoryData1}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
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
