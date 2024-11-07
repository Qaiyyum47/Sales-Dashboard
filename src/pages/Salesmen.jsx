import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Salesmen = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      <div className="mt-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Salesmen</h1>
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

      {/* Salesman Table */}
      <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden">
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
              Department
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Hire Date
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Commission Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredSalesmen.length > 0 ? (
            filteredSalesmen.map((salesman) => (
              <tr
                key={salesman.SalesmanID}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                  {salesman.SalesmanID}
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
              <td colSpan="7" className="text-center py-4 text-gray-800">
                No salesmen found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Salesmen;
