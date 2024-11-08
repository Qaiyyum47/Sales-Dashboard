import React, { useEffect, useState } from "react";

const Invoice = ({ orderId, onClose }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/invoices/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch invoice data");
        }
        const data = await response.json();
        setInvoiceData(data); // Assuming the response has the invoice data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchInvoice();
    }
  }, [orderId]);

  if (loading) {
    return <div>Loading invoice...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!invoiceData) {
    return <div>No invoice data available</div>;
  }

  // Check if Products is available and is an array before mapping
  const products = Array.isArray(invoiceData.Products) ? invoiceData.Products : [];

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
  <h2 className="text-2xl font-bold mb-6 text-center">Invoice Details</h2>

  {/* Invoice Header */}
<div className="border-b pb-4 mb-4 text-start">
  <div className="flex justify-between mb-2">
    <p className="font-bold">Bill To</p>
    <p className="font-bold text-end">Contact</p>
  </div>
  <div className="flex justify-between text-sm">
    <div className="flex flex-col">
      <p className="text-sm">{invoiceData.CustomerName}</p>
      <div className="w-3/6 py-1 break-words">
        <p className="text-sm">{invoiceData.Address}</p>
      </div>
      <p className="text-sm">{invoiceData.ContactNumber}</p>   
    </div>
    <div className="flex flex-col text-end">
      <p className="text-sm">{invoiceData.EmailAddress}</p>
      <p className="text-sm">{invoiceData.ContactNumber}</p>
      <p className="text-sm">Invoice#{invoiceData.InvoiceID}</p>
      <p className="text-sm">{new Date(invoiceData.OrderDate).toISOString().split('T')[0]}</p>
    </div>
  </div>
</div>


  {/* Invoice Details */}
  <div className="border-b pb-4 mb-4">
    <div className="flex justify-between text-sm">
      <p><strong>Order Status:</strong></p>
      <p>{invoiceData.OrderStatus}</p>
    </div>
    <div className="flex justify-between text-sm">
      <p><strong>Product:</strong></p>
      <p>{invoiceData.ProductName}</p>
    </div>
    <div className="flex justify-between text-sm">
      <p><strong>Quantity:</strong></p>
      <p>{invoiceData.Quantity}</p>
    </div>
    <div className="flex justify-between text-sm">
      <p><strong>Price per Unit:</strong></p>
      <p>${invoiceData.ProductPrice}</p>
    </div>
    <div className="flex justify-between text-sm border-t pt-4 mt-4">
      <p><strong>Total Amount:</strong></p>
      <p className="font-bold">${invoiceData.TotalLineAmount}</p>
    </div>
  </div>

  {/* Close Button */}
  <div className="mt-6 text-center">
    <button
      onClick={onClose}
      className="bg-gray-800 rounded-lg hover:bg-gray-700 text-white py-2 px-6 border shadow transition"
    >
      Close
    </button>
  </div>
</div>

  );
};

export default Invoice;
