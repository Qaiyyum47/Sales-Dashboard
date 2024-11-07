import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import CreateVendor from "../components/CreateVendor";
import RemoveVendor from "../components/RemoveVendor";
import EditVendor from "../components/EditVendor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Vendors = () => {
  // State definitions for vendors
const [vendors, setVendors] = useState([]); // Vendor list
const [vendorInventoryData, setVendorInventoryData] = useState([]); // Vendor inventory data
const [error, setError] = useState(null); // Error state
const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering

// Modals for adding, removing, and editing vendors
const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false); // Add Vendor modal
const [isRemoveVendorModalOpen, setIsRemoveVendorModalOpen] = useState(false); // Remove Vendor modal
const [vendorToRemove, setVendorToRemove] = useState(null); // Vendor to be removed
const [isEditVendorModalOpen, setIsEditVendorModalOpen] = useState(false); // Edit Vendor modal
const [selectedVendor, setSelectedVendor] = useState(null); // Vendor selected for editing
const [orders, setOrders] = useState([]);

// Navigation
const navigate = useNavigate();


  // Fetch vendors data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vendors");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setVendors(data);
        setOrders(data);
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

        setVendorInventoryData(formattedData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setError(error.message);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on search term
  const filteredVendors =
    vendors?.filter((vendor) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.VendorName.toLowerCase().includes(searchLower) ||
        vendor.ContactNumber.includes(searchTerm) ||
        vendor.Email.toLowerCase().includes(searchLower)
      );
    }) || [];

    const handleRemove = async (vendorId) => {
      console.log("Handling remove for vendor ID:", vendorId); // Log when remove action is triggered
      setVendorToRemove(vendorId); // Set the product ID for removal
      setIsRemoveVendorModalOpen(true); // Open the modal
    };
    
    
  // Handle edit action
  const handleEdit = (vendorId) => {
    console.log("Handling edit for vendor ID:", vendorId); // Log when edit action is triggered
    const vendor = vendors.find((p) => p.VendorID === vendorId);
    setSelectedVendor(vendor);
    setIsEditVendorModalOpen(true); // Ensure this is set to true
  };

  const handleSave = async (updatedVendor) => {
    try {
      console.log("Saving updated vendor:", updatedVendor); // Log before saving
      // Only update the DateAdded if it's a new value (optional logic)
      let updatedDate = updatedVendor.DateAdded;
      if (updatedDate && !isNaN(new Date(updatedDate).getTime())) {
        updatedDate = new Date(updatedDate).toISOString().slice(0, 10); // Format if valid
        console.log("Valid Date Added:", updatedDate); // Log formatted DateAdded
      } else {
        updatedDate = new Date().toISOString().slice(0, 10); // Default to current date if invalid
        console.log("Default Date Added:", updatedDate); // Log default DateAdded
      }

      const vendorToSave = { ...updatedVendor, DateAdded: updatedDate };

      console.log("Vendor to save:", vendorToSave); 

      // Send the update request to the server
      const response = await fetch(
        `http://localhost:5000/api/vendors/${vendorToSave.VendorID}`,
        {
          method: "PUT",
          body: JSON.stringify(vendorToSave),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update vendor");

      const data = await response.json();
      console.log("Updated vendor response:", data); // Log the response data from the server

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.VendorID === updatedVendor.VendorID
            ? { ...vendor, ...data }
            : vendor
        )
      );      

      setIsEditVendorModalOpen(false);
    } catch (error) {
      console.error("Error saving vendor:", error); // Log save error
      alert("There was an error updating the vendor. Please try again.");
    }
  };

  const confirmRemove = async () => {
    console.log("Handling remove for vendor ID:", vendorToRemove); // Log vendorToRemove here
  
    if (!vendorToRemove) {
      console.error("No vendor selected for removal.");
      return; // Exit early if no vendor ID is selected
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/vendors/${vendorToRemove}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete vendor");
      }
  
      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor.VendorID !== vendorToRemove)
      );
  
      setIsRemoveVendorModalOpen(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error removing vendor:", error);
      setError(error.message);
      setIsRemoveVendorModalOpen(false); // Close the modal even on error
    }
  };
  

  
  return (
    <div className="overflow-x-auto p-5">
      <h1 className="text-3xl font-bold">Vendors</h1>
      <div className="mt-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Vendors</h1>
        <div className="flex items-center space-x-2">
          <div>
            <button
              onClick={() => setIsAddVendorModalOpen(true)}
              className="mr-4 bg-gray-800 rounded-full hover:bg-gray-700 text-white py-2 px-4 border shadow transition"
            >
              Add Vendor
            </button>
            <Modal
              isOpen={isAddVendorModalOpen}
              onClose={() => setIsAddVendorModalOpen(false)}
            >
              <CreateVendor onClose={() => setIsAddVendorModalOpen(false)} />
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

      <div className="overflow-x-auto">
  <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
    <thead className="bg-gray-800 text-white">
      <tr>
        <th className="py-3 px-4 text-left border-b border-gray-300">No.</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Name</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Contact Number</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Address</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Email</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Website</th>
        <th className="py-3 px-4 text-left border-b border-gray-300">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {filteredVendors.length > 0 ? (
        filteredVendors.map((vendor, index) => (
          <tr key={vendor.VendorID}>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              {index + 1}
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              {vendor.VendorName}
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              {vendor.ContactNumber}
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              {vendor.Address}
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              {vendor.Email}
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
              <a
                href={vendor.WebsiteURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {vendor.WebsiteURL}
              </a>
            </td>
            <td className="py-4 px-4 border-b border-gray-300 text-gray-800 space-x-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleEdit(vendor.VendorID)}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleRemove(vendor.VendorID)}
                className="text-red-500 hover:underline"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="py-4 text-center text-gray-500">
            No vendors found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


<div className="flex flex-wrap gap-4 mt-6">
  {/* Vendors Inventory */}
  <div className="bg-white p-4 rounded-lg shadow-md flex-grow sm:w-full md:w-2/5 h-5/6">
    <h2 className="text-xl font-semibold mb-3">Vendors Inventory</h2>
    <p className="mb-6">Total stock levels across all vendors.</p>
    <ResponsiveContainer width="95%" height={300}>
      <BarChart
        data={vendorInventoryData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="vendor" /> {/* Change vendorName to vendor */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalStock" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Vendor Order Table */}
  <div className="bg-white p-4 rounded-lg shadow-md sm:w-full md:w-2/5 h-10/12 overflow-x-auto">
    <h2 className="text-xl font-semibold mb-3">Vendor Order</h2>
    <p className="mb-4">Each vendor stock order status.</p>

    <div className="overflow-x-auto">
      <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left border-b border-gray-300">Order ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Vendor</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Shipping Status</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">Total Stock</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {orders.slice(0, 4).map((order) => (
            <tr key={order.VendorID} className="hover:bg-gray-100 transition-all duration-200">
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.VendorID}</td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.VendorName}</td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.ShippingStatus}</td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.TotalStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
      </div>
    </div>
  );
};

export default Vendors;
