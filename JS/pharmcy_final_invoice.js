'use strict';

// ELEMENTS
const labelPharmacyName = document.querySelector('.name');
const labelPharmacyPhone = document.querySelector('.phone');
const labelPharmacyEmail = document.querySelector('.email');
const labelPharmacyAddress = document.querySelector('.address');
const invoiceBody = document.querySelector('.invoice-body');
const labelTotalPrice = document.querySelector('.total');
const btnCancel = document.querySelector('.cancel');
// GET ORDER ID FOR CURRENT PHARMACY...
// Get orderId from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
window.history.pushState({}, '', window.location.pathname);
// URL'S
const pharmacyInoiceURL = 'https://pharmalink.runasp.net/api/Order/Invoice/';
const cancelOrderURL = 'https://pharmalink.runasp.net/api/Order/Cancel/';
let cartInfo;
//  GET Order Summary
async function getInvoiceSummary(url, token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
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
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
// Displaying functions

// Update Price...
const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat('De', {
    style: 'currency',
    currency: 'EGP',
  }).format(+totalPrice);
  return price;
};
// Display all medicines...
const displayMedicines = function (medicines) {
  invoiceBody.innerHTML = '';
  medicines.forEach(function (medicine) {
    const { name, unitPrice, count, totalPrice } = medicine;
    const html = ` 
          <tr>
            <td class="medicine-name">${name.toLowerCase()}</td>
            <td class="number">${count}</td>
            <td class="number">${createPrice(unitPrice)}</td>
            <td class="number">${createPrice(totalPrice)}</td>
          </tr>`;
    invoiceBody.insertAdjacentHTML('afterbegin', html);
  });
};
// Display Pharmacy Information...
const displayPharmacyInfo = function ({
  pharmacyName,
  phone,
  pharmacyLicense,
  city,
}) {
  labelPharmacyName.textContent = pharmacyName;
  labelPharmacyPhone.textContent = phone;
  labelPharmacyEmail.textContent = pharmacyLicense;
  labelPharmacyAddress.textContent = city;
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
    pharmacyName,
    phone,
    pharmacyLicense,
    city,
    medicines,
    totalPriceOrder,
    statusOrder,
  } = invoice;
  cartInfo = {
    pharmacyName,
    phone,
    city,
    totalPriceOrder,
    medicines,
  };
  displayMedicines(medicines);
  displayTotalPrice(totalPriceOrder);
  displayPharmacyInfo({
    pharmacyName,
    phone,
    pharmacyLicense,
    city,
  });
  displayCancelBtn(statusOrder);
}
displayInvoiceInfo();
////////////////////Cancel Button/////////////////
const displayCancelBtn = function (state) {
  if (state !== 'pending') btnCancel.classList.add('hidden');
};
btnCancel.addEventListener('click', async function (e) {
  await cancelOrder(`${cancelOrderURL}${orderId}`, token);
  window.location.href = 'pharmacy_invoice.html';
});
