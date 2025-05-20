"use strict";

// ELEMENTS
const labelCompanyName = document.querySelector(".name");
const labelCompanyPhone = document.querySelector(".phone");
const labelOrderDate = document.querySelector(".email");
const labelCompanyAddress = document.querySelector(".address");
const invoiceBody = document.querySelector(".invoice-body");
const labelTotalPrice = document.querySelector(".total");
const btnCancel = document.querySelector(".cancel");
// GET ORDER ID FOR CURRENT PHARMACY...
// Get orderId from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");
// URL'S
const pharmacyInoiceURL = "https://pharmalink.runasp.net/api/Order/Invoice/";
const cancelOrderURL = "https://pharmalink.runasp.net/api/Order/Cancel/";
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
// CANCEL ORDER
async function cancelOrder(url, token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}
// Displaying functions

// Update Price...
const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat("De", {
    style: "currency",
    currency: "EGP",
  }).format(+totalPrice);
  return price;
};
// Formating date
const dateFormat = function (orderDate) {
  const date = new Intl.DateTimeFormat(navigator.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
            <td class="medicine-name">${name.toLowerCase()}</td>
            <td class="number">${count}</td>
            <td class="number">${createPrice(unitPrice)}</td>
            <td class="number">${createPrice(totalPrice)}</td>
          </tr>`;
    invoiceBody.insertAdjacentHTML("afterbegin", html);
  });
};
// Display Pharmacy Information...
const displayPharmacyInfo = function ({
  companyName,
  companyPhone,
  orderDate,
  companyCity,
  companyState,
  companyStreet,
}) {
  labelCompanyName.textContent = companyName;
  labelCompanyPhone.textContent = companyPhone;
  labelOrderDate.textContent = dateFormat(orderDate);
  labelCompanyAddress.textContent = `${companyCity} /${companyState} /${companyStreet}`;
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
    companyName,
    companyPhone,
    orderDate,
    medicines,
    companyCity,
    companyState,
    companyStreet,
    totalPriceOrder,
    statusOrder,
  } = invoice;

  displayMedicines(medicines);
  displayTotalPrice(totalPriceOrder);
  displayPharmacyInfo({
    companyName,
    companyPhone,
    orderDate,
    medicines,
    companyCity,
    companyState,
    companyStreet,
  });
  displayCancelBtn(statusOrder);
}
displayInvoiceInfo();
////////////////////Cancel Button/////////////////
const displayCancelBtn = function (state) {
  if (state !== "pending") btnCancel.classList.add("hidden");
};
btnCancel.addEventListener("click", async function (e) {
  await cancelOrder(`${cancelOrderURL}${orderId}`, token);
  window.location.href = "pharmacy_invoice.html";
});
