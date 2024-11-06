import React, { useState, useEffect } from 'react';

const Invoice = ({ selectedCustomer }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCustomer) return;
  }, [selectedCustomer]);

  if (!selectedCustomer) {
    return <div>No order selected</div>;
  }

  const orderDetails = selectedCustomer; // Use selectedCustomer passed from the parent

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="m-auto bg-white p-6 rounded-lg shadow-lg flex-grow w-11/12 h-auto border-gray-300 border">
      {orderDetails && (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="font-bold text-gray-800">Bill to :</p>
              <p className="text-gray-500">
                {orderDetails.CustomerName}<br />
                {orderDetails.ContactNumber}<br />
                {orderDetails.Email}
              </p>
            </div>
            <div className="text-right">
              <p>Invoice number: <span className="text-gray-500">{orderDetails.InvoiceID}</span></p>
              <p>
                Invoice date: <span className="text-gray-500">{new Date(orderDetails.InvoiceDate).toLocaleDateString()}</span><br />
                Due date: <span className="text-gray-500">{new Date(orderDetails.OrderDate).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full">
              <colgroup>
                <col className="w-full sm:w-1/2" />
                <col className="sm:w-1/6" />
                <col className="sm:w-1/6" />
                <col className="sm:w-1/6" />
              </colgroup>
              <thead className="border-b border-gray-300 text-gray-900">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Items</th>
                  <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Quantity</th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Price</th>
                  <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="font-medium text-gray-900 text-left">{orderDetails.ProductName}</div>
                    <div className="mt-1 truncate text-gray-500 text-left">{orderDetails.ProductDescription}</div>
                  </td>
                  <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{orderDetails.Quantity}</td>
                  <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">${orderDetails.ProductPrice.toFixed(2)}</td>
                  <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">${orderDetails.TotalLineAmount.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan="3" className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal</th>
                  <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal</th>
                  <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">${orderDetails.TotalLineAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
            Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
