const channel = new BroadcastChannel("refresh_channel");

const refreshPages = function () {
  channel.postMessage("refresh");
};
// URL'S

// const token = localStorage.getItem('token'); // or your token variable
const allCartItemsURL = "https://pharmalink.runasp.net/api/Cart";
const deleteCartItemURL =
  "https://pharmalink.runasp.net/api/Cart/DeleteCartItem/";
const updateCartItemURL =
  "https://pharmalink.runasp.net/api/Cart/UpdateCartItem";
// ElELMENTS
const containerItems = document.querySelector(".table-body");
const labelTotalprice = document.querySelector(".total");
const btnSummary = document.querySelector(".summary");
document.querySelector(".cart").classList.add("active");

// cart length
let cartLength;
// notification

const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat("DE", {
    style: "currency",
    currency: "EGP",
  }).format(totalPrice);
  return price;
};
const displayItems = function (cartItems) {
  containerItems.innerHTML = "";
  cartItems.forEach(function (item) {
    const { cartItemId, medicineName, medicinePrice, count, medicineImage } =
      item;
    const index = medicineImage.indexOf("uploads");

    const img = "http://pharmalink.runasp.net/" + medicineImage.slice(index);
    const html = `
            <tr class="table-row" id="row_${cartItemId}">
              <td class="item porduct-image"><img src="${img}" alt="" class='img'></td>
              <td class="item porduct-name">${medicineName}</td>
              <td class="item product-price">${createPrice(
                medicinePrice.slice(1)
              )}</td>
              <td class="item product-quantity">
                <button class="btn decrease"><i class="fa-solid fa-minus"></i></button>
                <p class="number">${count}</p>
                <button class=" btn increase"><i class="fa-solid fa-plus"></i></button></td>
              <td><button class="delete-button delete">
                    <svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                  </button></i>
              <td>
            </tr>`;
    // console.log(html);
    containerItems.insertAdjacentHTML("afterbegin", html);
  });
};

const displayTotal = function (totalPrice) {
  labelTotalprice.textContent = createPrice(totalPrice);
};
// Function To GET Current User Cart
async function getCartItems(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Cart fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
// Function To Update Quentity of Medicane
async function updateCartItem(url, token, updatedData) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(updatedData),
  });
}
// Function to Delete Current User Cart Item
async function deleteCartItem(url, token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Cart delete failed: ${response.status}`);
  }
}
// Display Cart items and Total....
async function displayAllItems() {
  try {
    const cart = await getCartItems(allCartItemsURL, token);
    displayItems(cart.cartItems);
    displayTotal(cart.totalPrice);
    cartLength = cart.cartItems.length;
  } catch (err) {
    console.error(err.message);
  }
}

displayAllItems();
// Delete Select item....
containerItems.addEventListener("click", async function (e) {
  if (e.target.classList.contains("delete")) {
    const row = e.target.parentElement.parentElement.id;
    const index = row.indexOf("_") + 1;
    const deletedRow = row.slice(index);

    try {
      await deleteCartItem(`${deleteCartItemURL}${deletedRow}`, token);
      showNotification("✅ Item removed from your cart successfully.", true);
      await displayAllItems();
    } catch (err) {}
  }
});
// increase or decrease Cart Item Quentity...
containerItems.addEventListener("click", async function (e) {
  const btnIncrease = e.target?.closest(".increase");
  const btnDecrease = e.target?.closest(".decrease");
  const row = e.target?.closest("tr");

  if (!row || (!btnIncrease && !btnDecrease)) return;

  const labelNumber = row.querySelector(".number");
  const index = row.id.indexOf("_") + 1;
  const cartItemId = +row.id.slice(index);

  let quantity = +labelNumber.textContent;
  const originalQuantity = quantity;

  // Lock buttons
  btnIncrease?.setAttribute("disabled", true);
  btnDecrease?.setAttribute("disabled", true);

  if (btnIncrease) quantity++;
  if (btnDecrease) quantity--;

  const updatedItem = {
    id: cartItemId,
    count: quantity,
  };

  try {
    await updateCartItem(updateCartItemURL, token, updatedItem);
    labelNumber.textContent = quantity;

    const cart = await getCartItems(allCartItemsURL, token);
    displayTotal(cart.totalPrice);
  } catch (err) {
    if (err.message.includes("400")) {
      // alert('❌ Operation cannot be completed: quantity not available');
    }
    labelNumber.textContent = originalQuantity;
  } finally {
    // Unlock buttons
    btnIncrease?.removeAttribute("disabled");
    btnDecrease?.removeAttribute("disabled");
  }

  if (!quantity) {
    row.remove();
    const cart = await getCartItems(allCartItemsURL, token);
    displayTotal(cart.totalPrice);
  }
  refreshPages();
});
btnSummary.addEventListener("click", function (e) {
  if (cartLength) window.location.href = "Company_final_invoice.html";
  else showNotification("Cart is empty", false);
});
// /////////////////////////////////////////////

channel.onmessage = (event) => {
  if (event.data === "refresh") {
    location.reload();
  }
};
