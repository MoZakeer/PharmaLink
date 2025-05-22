const channel = new BroadcastChannel("refresh_channel");

const refreshPages = function () {
  channel.postMessage("refresh");
};
// URL'S

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
let btnDelete = `<button class="delete-button delete">
                    <svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                  </button>`;
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
            <tr class="table-row" data-item-id=${cartItemId}>
              <td class="item porduct-image"><img src="${img}" alt="" class='img'></td>
              <td class="item porduct-name">${medicineName}</td>
              <td class="item product-price">${createPrice(medicinePrice)}</td>
              <td class="item product-quantity">
                <button class="btn decrease"><i class="fa-solid fa-minus"></i></button>
                <p class="number">${count}</p>
                <button class=" btn increase"><i class="fa-solid fa-plus"></i></button></td>
              <td>
              ${btnDelete}
              </td>
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
    throw new Error(`Cart fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
// Function To Update Quentity of Medicane
async function updateCartItem(url, token, updatedData) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Sorry, the required quantity is not available at the moment`,
      };
    }

    return { success: true, message: "Quantity updated successfully!" };
  } catch (error) {
    // console.error(error);
    return {
      success: false,
      message: "Something went wrong while connecting to the server",
    };
  }
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
  const btnDelete = e.target?.closest(".delete");
  if (btnDelete?.classList.contains("delete")) {
    const row = btnDelete?.closest("tr");
    const id = +row.dataset.itemId;
    await deleteCartItem(`${deleteCartItemURL}${id}`, token);
    showNotification("Item removed from your cart successfully.", true);
    await displayAllItems();
  }
});
// increase or decrease Cart Item Quentity...
containerItems.addEventListener("click", async function (e) {
  const btn = e.target?.closest(".btn");
  if (!btn) return;
  const row = btn?.closest("tr");
  const id = +row.dataset.itemId;
  const labelNumber = row.querySelector(".number");
  const btnIncrease = btn.classList.contains("increase");
  const btnDecrease = btn.classList.contains("decrease");
  let quantity = +labelNumber.textContent;
  const updatedData = {
    id,
    count: btnIncrease ? quantity + 1 : quantity - 1,
  };
  try {
    const response = await updateCartItem(
      updateCartItemURL,
      token,
      updatedData
    );
    if (btnIncrease) {
      if (!response.success) showNotification(response.message, false);
    }

    displayAllItems();
  } catch (error) {}
});
btnSummary.addEventListener("click", function (e) {
  if (cartLength) window.location.href = "place_order.html";
  else showNotification("Cart is empty", false);
});
// /////////////////////////////////////////////

channel.onmessage = (event) => {
  if (event.data === "refresh") {
    location.reload();
  }
};
