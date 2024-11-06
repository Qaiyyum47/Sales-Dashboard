import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import CreateVendor from '../components/CreateVendor';
import RemoveVendor from '../components/RemoveVendor';
import EditVendor from '../components/EditVendor';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Vendors = () => {
  // State definitions for vendors
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isRemoveVendorModalOpen, setIsRemoveVendorModalOpen] = useState(false);
  const [vendorToRemove, setVendorToRemove] = useState(null);
  const [isEditVendorModalOpen, setIsEditVendorModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [vendorInventoryData, setVendorInventoryData] = useState([]);
  const navigate = useNavigate();

  // Fetch vendors data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vendors'); 
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
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

        const formattedData = Object.keys(groupedData).map(vendor => ({
          vendor,
          totalStock: groupedData[vendor]
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
  const filteredVendors = vendors?.filter(vendor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vendor.VendorName.toLowerCase().includes(searchLower) ||
      vendor.ContactNumber.includes(searchTerm) ||
      vendor.Email.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Handle vendor removal
  const handleRemove = async (vendorName) => {
    if (window.confirm("Are you sure you want to remove this vendor?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/vendors/${vendorName}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete vendor');
        }

        setVendors(prevVendors => prevVendors.filter(vendor => vendor.VendorName !== vendorName));
      } catch (error) {
        console.error("Error removing vendor:", error);
        setError(error.message);
      }
    }
  };

  const handleEditVendor = (vendorName) => {
    // Find the vendor by VendorName
    const vendor = vendors.find(v => v.VendorName === vendorName); 

    // Ensure a vendor was found
    if (vendor) {
        setSelectedVendor(vendor); // Set the selected vendor for editing
        setIsEditVendorModalOpen(true); // Open the modal for editing
    } else {
        console.error('Vendor not found!');
    }
};


  // Handle save vendor changes
  const handleSaveVendor = async (updatedVendor) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vendors/${updatedVendor.VendorID}`, {
        method: 'PUT',
        body: JSON.stringify(updatedVendor),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor');
      }

      const data = await response.json();
      setVendors(prevVendors =>
        prevVendors.map(vendor =>
          vendor.VendorID === updatedVendor.VendorID ? { ...vendor, ...data } : vendor
        )
      );
      setIsEditVendorModalOpen(false);
    } catch (error) {
      console.error('Error saving vendor:', error);
      setError('There was an error updating the vendor. Please try again.');
    }
  };

  // Handle add vendor logic
  const handleAddVendor = async (newVendor) => {
    try {
      const response = await fetch('http://localhost:5000/api/vendors', {
        method: 'POST',
        body: JSON.stringify(newVendor),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to add vendor');
      }

      const data = await response.json();
      setVendors(prevVendors => [...prevVendors, data]);
      setIsAddVendorModalOpen(false);
    } catch (error) {
      console.error('Error adding vendor:', error);
      setError('There was an error adding the vendor. Please try again.');
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
            <Modal isOpen={isAddVendorModalOpen} onClose={() => setIsAddVendorModalOpen(false)}>
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
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{index + 1}</td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.VendorName}</td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.ContactNumber}</td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.Address}</td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{vendor.Email}</td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                        <a href={vendor.WebsiteURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{vendor.WebsiteURL}</a>
                    </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800 space-x-4">
                <button className="text-blue-500 hover:underline"
    onClick={() => handleEditVendor(vendor.VendorName)} // Pass VendorName here
>
    <FaEdit />
</button>

                  <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => {
                      setVendorToRemove(vendor.VendorName);
                      setIsRemoveVendorModalOpen(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">No vendors found</td>
            </tr>
          )}
        </tbody>
      </table>


      <div className="flex flex-grow mt-6 gap-4">

      <div className="bg-white p-4 rounded-lg shadow-md flex-grow h-5/6">
    <h2 className="text-xl font-semibold mb-3">Vendors Inventory</h2>
    <p className="mb-6">Total stock levels across all vendors.</p>
    <ResponsiveContainer width="95%" height={300}>
  <BarChart data={vendorInventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="vendor" /> {/* Change vendorName to vendor */}
    <YAxis />
    <Tooltip />
    <Bar dataKey="totalStock" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>


</div>


      {/* Remove Vendor Modal */}
      <Modal isOpen={isRemoveVendorModalOpen} onClose={() => setIsRemoveVendorModalOpen(false)}>
        <RemoveVendor
          vendorName={vendorToRemove}
          onRemove={() => handleRemove(vendorToRemove)}
          onClose={() => setIsRemoveVendorModalOpen(false)}
        />
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal isOpen={isEditVendorModalOpen} onClose={() => setIsEditVendorModalOpen(false)}>
        <EditVendor
          vendor={selectedVendor}
          onSave={handleSaveVendor}
          onClose={() => setIsEditVendorModalOpen(false)}
        />
      </Modal>

      <div className="bg-white p-4 rounded-lg shadow-md w-2/5 h-10/12">
        <h2 className="text-xl font-semibold mb-3">Performance</h2>
        <p className="mb-6">Each category performance</p>

        {/* Vendor Orders Table */}
        <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Order ID</th>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Vendor</th>
                    <th className="py-3 px-4 text-left border-b border-gray-300">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {/* Dummy Data */}
                {[
                    { id: '001', vendorName: 'Vendor A', status: 'Pending' },
                    { id: '002', vendorName: 'Vendor B', status: 'Completed' },
                    { id: '003', vendorName: 'Vendor C', status: 'Shipped' },
                ].map(order => (
                    <tr key={order.id} className="hover:bg-gray-100 transition-all duration-200">
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.id}</td>
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.vendorName}</td>
                        <td className="py-4 px-4 border-b border-gray-300 text-gray-800">{order.status}</td>
                    </tr>
                ))}
                {/* If no orders were present, this line would display */}
                <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-800">No orders found</td>
                </tr>
            </tbody>
        </table>
                </div>

      </div>
    </div>
  );
};

export default Vendors;
