"use strict";
if (type !== "Company") window.location.href = 'home.html';

// ELEMENTS
let invoices;
let username;
const invoicesBody = document.querySelector(".invoices-body");
// URL'S
const invoicesURL = "https://pharmalink.runasp.net/api/Order/IndexCompanyOrder";
const toShippedInvoiceURL = "https://pharmalink.runasp.net/api/Order/done/";
const toDeliveredInvoiceURL = "https://pharmalink.runasp.net/api/Order/deliver/";
document.querySelector(".orders").classList.add("active");
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
const statusPriority = {
  pending: 1,
  shipped: 2,
  delivered: 3,
};
const displayInvoices = function (companyInvoices) {
  companyInvoices = companyInvoices.sort((a, b) => {
    return statusPriority[a.statusOrder] - statusPriority[b.statusOrder];
  });
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
          <td><a href='#' title='Go to Profile' class='profile'>${pharmacyName}</a></td>
          <td>${drName}</td>
          <td>${pharmacyPhone}</td>
          <td>${city}</td>
          <td> ${dateFormat(orderDate)}</td>
          <td><button class="btns btn-${statusOrder}">${statusOrder}</button></td>
          <td>
            <button class="btn invoice">invoice</button>
          </td>
        </tr>`;
    invoicesBody.insertAdjacentHTML("beforeend", html);
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
// UPDATE INVOICE STATUS
async function updateInvoiceStateToDelivered(url, token) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`PATCH request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
async function updateInvoiceStateToShipped(url, token) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    throw new Error(`PATCH request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
async function displayAllInvoices() {
  const data = await getCompanyOrders(invoicesURL, token);
  invoices = data;
  displayInvoices(data);
}
displayAllInvoices();
// Go to order invoice
invoicesBody.addEventListener("click", function (e) {
  const btnInvoice = e.target?.closest(".invoice");
  if (btnInvoice?.classList.contains("invoice")) {
    const row = e.target?.closest("tr");
    const orderID = row?.dataset?.orderId;
    window.location.href = `final_invoice.html?orderId=${orderID}`;
  }
});
// change invoice Pinding State to Shipped
invoicesBody.addEventListener("click", async function (e) {
  const row = e.target?.closest("tr");
  const orderId = +row?.dataset?.orderId;

  const btnPending = e.target.closest(".btn-pending");
  const btnShipped = e.target.closest(".btn-shipped");

  if (btnPending?.classList.contains("btn-pending")) {
    btnPending.classList.remove("btn-pending");
    btnPending.classList.add("btn-shipped");
    btnPending.textContent = "shipped";

    try {
      const response = await updateInvoiceStateToShipped(
        `${toShippedInvoiceURL}${orderId}`,
        token
      );
    } catch (err) {
      console.error("Failed to update to shipped:", err);
    }

    window.location.reload();
    return;
  }

  if (btnShipped?.classList.contains("btn-shipped")) {
    btnShipped.classList.remove("btn-shipped");
    btnShipped.classList.add("btn-delivered");
    btnShipped.textContent = "Delivered";

    try {
      const response = await updateInvoiceStateToDelivered(
        `${toDeliveredInvoiceURL}${orderId}`,
        token
      );
    } catch (err) {
      console.error("Failed to update to delivered:", err);
    }

    window.location.reload();
  }
});

// change invoice Shipped State to Delivered
// invoicesBody.addEventListener("click", async function (e) {});
invoicesBody.addEventListener("click", function (e) {
  e.preventDefault();
  const pharmacyName = e.target?.closest(".profile");
  if (pharmacyName?.classList.contains("profile")) {
    const row = e.target?.closest("tr");
    const orderId = +row?.dataset?.orderId;
    const pharmacyUsername = invoices.find(
      (invoice) => invoice.orderID === orderId
    ).pharmacyUserName;
    localStorage.setItem("userName", pharmacyUsername);
    window.location.href = "profile-pharmacy.html";
  }
});
