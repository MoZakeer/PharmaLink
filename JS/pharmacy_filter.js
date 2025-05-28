"use strict";
// some Styling
const btnPending = document.querySelector(".btn-pending");
const btnShipped = document.querySelector(".btn-shipped");
const btnDeliverd = document.querySelector(".btn-delivered");
const displaySelectedInvioces = function (pharmacyInvoices, selectedState) {
  pharmacyInvoices.forEach(function (invoice) {
    const { orderID, companyName, orderDate, statusOrder, city } = invoice;
    const cancel = statusOrder === "pending";
    const html = `
          <tr data-order-id="${orderID}">
            <td><a href='#' title='Go to Profile' class='profile'>${companyName}</a></td>
            <td>${city}</td>
            <td>${dateFormat(orderDate)}</td>
            <td>${statusOrder}</td>
            <td><button class="btn invoice">
            <i class="fa-solid fa-receipt" style="color: #a5b3ca;"></i>
            invoice</button></td>
          </tr>`;
    if (statusOrder === selectedState)
      invoicesBody.insertAdjacentHTML("afterbegin", html);
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
