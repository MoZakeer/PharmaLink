"use strict";
if (type !== "Pharmacy") window.location.href = 'home.html';
document.querySelector(".history").classList.add("active");

// ELEMENTS
const invoicesBody = document.querySelector(".invoices-body");
// URL'S
const invoicesURL = "https://pharmalink.runasp.net/api/Order/IndexPharmacyOrder";
const complateInvoiceURL = "https://pharmalink.runasp.net/api/Order/done/";

let invoices;
// DATE FORMATER
const dateFormat = function (orderDate) {
  const date = new Intl.DateTimeFormat(navigator.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(orderDate));
  return date;
};
// DISPLAY COMPANY INVOICES
const displayInvoices = function (companyInvoices) {
  companyInvoices.forEach(function (invoice) {
    const { orderID, companyName, orderDate, statusOrder, city } = invoice;
    const cancel = statusOrder === "pending";
    const html = `
         <tr data-order-id="${orderID}">
            <td><a href='#' title='Go to Profile' class='profile'>${companyName}</a></td>
            <td>${city}</td>
            <td>${dateFormat(orderDate)}</td>
            <td>${statusOrder}</td>
            <td><button class="btn invoice">
            invoice</button></td>
          </tr>`;
    invoicesBody.insertAdjacentHTML("afterbegin", html);
  });
};
// GET ALL COMPANY ORDERS
async function getCompanyOrders(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch company orders: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
// Cancel order
async function cancelOrder(url, token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

async function displayAllInvoices() {
  const data = await getCompanyOrders(invoicesURL, token);
  invoices = data;
  displayInvoices(data);
}
displayAllInvoices();
// change invoice state
invoicesBody.addEventListener("click", function (e) {
  const btnInvoice = e.target.closest(".invoice");
  if (btnInvoice?.classList?.contains("invoice")) {
    const row = e.target?.closest("tr");
    const orderID = row?.dataset?.orderId;
    window.location.href = `pharmcy_final_invoice.html?orderId=${orderID}`;
  }
});
invoicesBody.addEventListener("click", function (e) {
  e.preventDefault();
  const companyName = e.target?.closest(".profile");
  if (companyName?.classList.contains("profile")) {
    const row = e.target?.closest("tr");
    const orderId = +row?.dataset?.orderId;
    const companyUsername = invoices.find(
      (invoice) => invoice.orderID === orderId
    ).companyUserName;
    localStorage.setItem("userName", companyUsername);
    window.location.href = "profile-company.html";
  }
});
