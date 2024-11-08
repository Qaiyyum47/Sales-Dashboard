import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Modal from "../components/Modal";
import CreateSalesmen from "../components/CreateSalesmen.jsx";

const Salesmen = () => {
  // State definitions for salesmen
  const [salesmen, setSalesmen] = useState([]); // Salesman list
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering salesmen

  // Modal for adding salesmen
  const [isAddSalesmanModalOpen, setIsAddSalesmanModalOpen] = useState(false); // Add Salesman modal

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salesmen"); // Adjust the API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch salesmen");
        }
        const data = await response.json();
        setSalesmen(data);
      } catch (error) {
        console.error("Error fetching salesmen:", error);
        setError(error.message);
      }
    };

    fetchSalesmen();
  }, []);

  // Filter salesmen based on the search term
  const filteredSalesmen = salesmen.filter((salesman) => {
    return (
      salesman.SalesmanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesman.ContactNumber.includes(searchTerm) ||
      salesman.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="overflow-x-auto p-5">
      <h1 className="text-3xl font-bold">Salesmen</h1>
      <div className="mt-1 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Salesmen</h1>
        <div className="flex items-center space-x-2">
          <div>
            <button
              onClick={() => setIsAddSalesmanModalOpen(true)}
              className="mr-4 bg-gray-800 rounded-full hover:bg-gray-700 text-white py-2 px-4 border shadow transition"
            >
              Add Salesman
            </button>

            <Modal
              isOpen={isAddSalesmanModalOpen}
              onClose={() => setIsAddSalesmanModalOpen(false)}
            >
              <CreateSalesmen onClose={() => setIsAddSalesmanModalOpen(false)} />
            </Modal>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search salesmen..."
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
              <th className="py-3 px-4 text-left border-b border-gray-300">Email</th>
              <th className="py-3 px-4 text-left border-b border-gray-300">Department</th>
              <th className="py-3 px-4 text-left border-b border-gray-300">Hire Date</th>
              <th className="py-3 px-4 text-left border-b border-gray-300">Commission Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredSalesmen.length > 0 ? (
              filteredSalesmen.map((salesman, index) => (
                <tr key={salesman.SalesmanID}>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {salesman.SalesmanName}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {salesman.ContactNumber}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {salesman.Email}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {salesman.Department}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {new Date(salesman.HireDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                    {salesman.CommissionRate}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No salesmen found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Salesmen;
