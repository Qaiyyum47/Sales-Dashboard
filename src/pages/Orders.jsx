import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Modal from "../components/Modal";
import Invoice from "../components/Invoice";

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle the selection of a customer and open the modal
  const handleSelected = (customerName) => {
    console.log("Handling select for customer:", customerName); // Log when customer is selected
    const customerOrder = orders.find(
      (order) => order.CustomerName === customerName
    );
    setSelectedCustomer(customerOrder);
    setIsModalOpen(true); // Open the modal when customer is selected
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null); // Clear the selected order data
    setInvoiceContent(null); // Clear the invoice content
    setIsModalOpen(false); // Close the modal
  };

  const filteredOrders = orders.filter((order) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      order.Status?.toLowerCase().includes(lowerCaseSearchTerm) ||
      order.ShippingAddress?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return <div className="text-center">Loading orders...</div>;
  }

  return (
    <div className="overflow-x-auto p-5">
      <h1 className="text-3xl font-bold">Orders</h1>
      <table className="shadow-md min-w-full border-collapse rounded-lg overflow-hidden mt-4">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              No.
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Customer Name
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Contact Number
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Email
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Order Date
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Status
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Quantity
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {orders.map((order, index) => (
            <tr
              key={`${order.OrderID}-${index}`}
              className="hover:bg-gray-100 transition-all duration-200"
            >
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {index + 1}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {order.CustomerName}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {order.ContactNumber}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {order.Email}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {new Date(order.OrderDate).toLocaleDateString()}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {order.OrderStatus}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-gray-800">
                {order.Quantity}
              </td>
              <td className="py-4 px-4 border-b border-gray-300 text-blue-600">
                <button
                  onClick={() => handleSelected(order.CustomerName)}
                  className="text-blue-500 underline"
                >
                  View Invoice
                </button>
              </td>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Invoice
                  selectedCustomer={selectedCustomer}
                  onClose={() => setIsModalOpen(false)}
                />
              </Modal>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Orders;
