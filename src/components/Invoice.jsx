import React from 'react';

const Invoice = () => {
  const company = {
    name: "SalesSync.",
    email: "salesSync123@yahoo.com",
    phone: "+1-234-567890",
    vat: "1234567890",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  };

  const client = {
    name: "Aiman Abdul Rahman",
    address: "No. 1, Jalan 1, Kuala Lumpu",
    email: "aiman@gmail.com",
  };

  const invoiceData = {
    number: "INV-2023786123",
    date: "03/07/2023",
    dueDate: "31/07/2023",
    items: [
      {
        description: "Dell Inspiron Laptop",
        quantity: 2,
        price: 799.99,
      },
      {
        description: "HP Pavilion Desktop",
        quantity: 3,
        price: 999.99,
      },
      {
        description: "Logitech Wireless Mouse",
        quantity: 5,
        price: 29.99,
      },
    ],
  };

  const subtotal = invoiceData.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const discount = subtotal * 0.1; // 10% discount
  const total = subtotal + tax - discount;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
      <div className="grid grid-cols-2 items-center">
        <div>
          <img src={company.logo} alt="company-logo" height="100" width="100" />
        </div>
        <div className="text-right">
          <p>{company.name}</p>
          <p className="text-gray-500 text-sm">{company.email}</p>
          <p className="text-gray-500 text-sm mt-1">{company.phone}</p>
          <p className="text-gray-500 text-sm mt-1">VAT: {company.vat}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center mt-8">
        <div>
          <p className="font-bold text-gray-800">Bill to :</p>
          <p className="text-gray-500">{client.name}<br />{client.address}</p>
          <p className="text-gray-500">{client.email}</p>
        </div>
        <div className="text-right">
          <p>Invoice number: <span className="text-gray-500">{invoiceData.number}</span></p>
          <p>
            Invoice date: <span className="text-gray-500">{invoiceData.date}</span><br />
            Due date: <span className="text-gray-500">{invoiceData.dueDate}</span>
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
            {invoiceData.items.map((item, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">{item.description}</div>
                  <div className="mt-1 truncate text-gray-500">Description goes here.</div>
                </td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{item.quantity}</td>
                <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">${item.price.toFixed(2)}</td>
                <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan="3" className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal</th>
              <th scope="row" className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal</th>
              <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan="3" className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Tax</th>
              <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Tax</th>
              <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">${tax.toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan="3" className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Discount</th>
              <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Discount</th>
              <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">- 10%</td>
            </tr>
            <tr>
              <th scope="row" colSpan="3" className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total</th>
              <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total</th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
      </div>
    </div>
  );
};

export default Invoice;
