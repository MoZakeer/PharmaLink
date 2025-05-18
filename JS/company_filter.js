"use strict";
// some Styling
const btnPending = document.querySelector(".btn-pending");
const btnShipped = document.querySelector(".btn-shipped");
const btnDeliverd = document.querySelector(".btn-delivered");

const displaySelectedInvioces = function (companyInvoices, selectedState) {
  companyInvoices.forEach(function (invoice) {
    const {
      orderID,
      pharmacyName,
      drName,
      pharmacyPhone,
      orderDate,
      statusOrder,
      city,
    } = invoice;

    const html = `
        <tr data-order-id="${orderID}">
          <td>${pharmacyName}</td>
          <td>${drName}</td>
          <td>${pharmacyPhone}</td>
          <td>${city}</td>
          <td> ${dateFormat(orderDate)}</td>
          <td><button class="btns btn-${statusOrder}">${statusOrder}</button></td>
          <td>
            <button class="btn invoice">invoice</button>
          </td>
        </tr>`;
    if (statusOrder === selectedState)
      invoicesBody.insertAdjacentHTML("beforeend", html);
  });
};
btnPending.addEventListener("click", function () {
  invoicesBody.innerHTML = "";
  displaySelectedInvioces(invoices, "pending");
});
btnShipped.addEventListener("click", function () {
  invoicesBody.innerHTML = "";
  displaySelectedInvioces(invoices, "shipped");
});
btnDeliverd.addEventListener("click", function () {
  invoicesBody.innerHTML = "";
  displaySelectedInvioces(invoices, "delivered");
});
