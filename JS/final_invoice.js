"use strict";

// ELEMENTS
const labelPharmacyName = document.querySelector(".name");
const labelPharmacyPhone = document.querySelector(".phone");
const labelOrderDate = document.querySelector(".email");
const labelPharmacyAddress = document.querySelector(".address");
const invoiceBody = document.querySelector(".invoice-body");
const labelTotalPrice = document.querySelector(".total");
const btnPlaceOrder = document.querySelector(".place-order");
// GET ORDER ID FOR CURRENT PHARMACY...
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
// URL'S
const pharmacyInoiceURL = "https://pharmalink.runasp.net/api/Order/Invoice/";
let cartInfo;
//  GET Order Summary
async function getInvoiceSummary(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Invoice summary fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
// POST NEW ORDER TO COMPANY

// Displaying functions

// Update Price...
const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat("DE", {
    style: "currency",
    currency: "EGP",
  }).format(totalPrice);
  return price;
};
// Formating date
const dateFormat = function (orderDate) {
  const date = new Intl.DateTimeFormat(navigator.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second:'2-digit'
  }).format(new Date(orderDate));
  return date;
};
// Display all medicines...
const displayMedicines = function (medicines) {
  invoiceBody.innerHTML = "";
  medicines.forEach(function (medicine) {
    const { name, unitPrice, count, totalPrice } = medicine;
    const html = ` 
          <tr>
            <td class="medicine-name">${name}</td>
            <td class="number">${count}</td>
            <td class="number">${createPrice(unitPrice)}</td>
            <td class="number">${createPrice(totalPrice)}</td>
          </tr>`;
    invoiceBody.insertAdjacentHTML("afterbegin", html);
  });
};
// Display Pharmacy Information...
const displayPharmacyInfo = function ({
  pharmacyName,
  pharmacyPhone,
  pharmacyCity,
  pharmacyState,
  pharmacyStreet,
  orderDate,
}) {
  labelPharmacyName.textContent = pharmacyName;
  labelPharmacyPhone.textContent = pharmacyPhone;
  labelOrderDate.textContent = dateFormat(orderDate);
  labelPharmacyAddress.textContent = `${pharmacyCity} /${pharmacyState} /${pharmacyStreet}`;
};
// Display Total Price
const displayTotalPrice = function (totalPrice) {
  labelTotalPrice.textContent = createPrice(totalPrice);
};

async function displayInvoiceInfo() {
  const invoice = await getInvoiceSummary(
    `${pharmacyInoiceURL}${orderId}`,
    token
  );
  const {
    orderID,
    pharmacyName,
    pharmacyPhone,
    pharmacyCity,
    pharmacyState,
    pharmacyStreet,
    orderDate,
    totalPriceOrder,
    medicines,
  } = invoice;
  console.log(invoice);
  cartInfo = {
    pharmacyName,
    pharmacyPhone,
    pharmacyCity,
    pharmacyState,
    pharmacyStreet,
    orderDate,
    totalPriceOrder,
    medicines,
  };
  displayMedicines(medicines);
  displayTotalPrice(totalPriceOrder);
  displayPharmacyInfo({
    pharmacyName,
    pharmacyPhone,
    pharmacyCity,
    pharmacyState,
    pharmacyStreet,
    orderDate,
  });
}
displayInvoiceInfo();

// /////////////////////////////////
const channel = new BroadcastChannel("refresh_channel");
channel.onmessage = (event) => {
  if (event.data === "refresh") {
    location.reload();
  }
};
