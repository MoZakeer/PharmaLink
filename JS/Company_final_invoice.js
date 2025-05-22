"use strict";
// ELEMENTS
//
const labelCompanyName = document.querySelector(".name");
const labelCompanyPhone = document.querySelector(".phone");
const labelOrderDate = document.querySelector(".email");
const labelCompanyAddress = document.querySelector(".address");
const invoiceBody = document.querySelector(".invoice-body");
const labelTotalPrice = document.querySelector(".total");
const btnPlaceOrder = document.querySelector(".place-order");
let cartInfo = {};
// URL'S
const pharmacyInoiceURL = "https://pharmalink.runasp.net/api/Cart/Summary";
const pharmacyPlaceOrderURL =
  "https://pharmalink.runasp.net/api/Order/PlaceOrder";
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
async function placeOrder(url, token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Order placement failed: ${errorMessage}`);
  }
}
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
  }).format(new Date(orderDate));
  return date;
};
// Display all medicines...
const displayMedicines = function (medicines) {
  invoiceBody.innerHTML = "";
  medicines.forEach(function (medicine) {
    const { medicineName, medicinePrice, count, totalItemPrice } = medicine;
    const html = ` 
          <tr>
            <td class="medicine-name">${medicineName}</td>
            <td class="number">${count}</td>
            <td class="number">${createPrice(medicinePrice)}</td>
            <td class="number">${createPrice(totalItemPrice)}</td>
          </tr>`;
    invoiceBody.insertAdjacentHTML("afterbegin", html);
  });
};
// Display Pharmacy Information...
const displayPharmacyInfo = function ({
  compayName,
  companyPhone,
  orderDate,
  companyAddress,
}) {
  labelCompanyName.textContent = compayName;
  labelCompanyPhone.textContent = companyPhone;
  labelOrderDate.textContent = dateFormat(orderDate);
  labelCompanyAddress.textContent = companyAddress;
};
// Display Total Price
const displayTotalPrice = function (totalPrice) {
  labelTotalPrice.textContent = createPrice(totalPrice);
};
// Check min total price for company
const checkMinPrice = function (minPrice, totalPrice) {
  return totalPrice >= minPrice;
};

async function displayInvoiceInfo() {
  const invoice = await getInvoiceSummary(pharmacyInoiceURL, token);
  const {
    compayName,
    companyPhone,
    orderDate,
    companyAddress,
    totalCartPrice,
    cartId,
    companyId,
    medicines,
    minPriceToMakeOrder,
    pharmacyName, 
  } = invoice;
  cartInfo = {
    cartId,
    companyId,
    minPriceToMakeOrder,
    totalCartPrice,
    pharmacyName,
  };
  displayMedicines(medicines);
  displayTotalPrice(totalCartPrice);
  displayPharmacyInfo({
    compayName,
    companyPhone,
    orderDate,
    companyAddress,
  });
}
displayInvoiceInfo();

// Place order Event
btnPlaceOrder.addEventListener("click", async function (e) {
  const {
    cartId,
    companyId,
    minPriceToMakeOrder,
    totalCartPrice,
    pharmacyName,
  } = cartInfo;
  if (checkMinPrice(minPriceToMakeOrder, totalCartPrice)) {
    const url = `${pharmacyPlaceOrderURL}/${cartId}/${companyId}`;
    await placeOrder(url, token);
    showNotification("Your order has been placed successfully.", true);
    setTimeout(() => (window.location.href = "search.html"), 600);
  } else {
    showNotification(
      `Total price must be at least ${minPriceToMakeOrder}$ `,
      false
    );
  }
});
// //////////////
const channel = new BroadcastChannel("refresh_channel");

channel.onmessage = (event) => {
  if (event.data === "refresh") {
    location.reload();
  }
};
