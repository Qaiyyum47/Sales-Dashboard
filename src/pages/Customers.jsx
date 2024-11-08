import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customers"); // Adjust the API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError(error.message);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.ContactNumber.includes(searchTerm) ||
      customer.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.Address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="overflow-x-auto p-5">
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="mt-1 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Customers</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="border rounded-full pl-10 pr-4 py-2 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Customers Table */}
      <table className="min-w-full border-collapse rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left border-b border-gray-300">ID</th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Name
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Contact Number
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Email
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Date Joined
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr
                key={customer.CustomerID}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {customer.CustomerID}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {customer.CustomerName}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {customer.ContactNumber}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {customer.Email}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {new Date(customer.DateJoined).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {customer.Address}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-800">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Customers;
