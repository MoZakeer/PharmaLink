if (type !== "Pharmacy") location.href = '../home.html';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.querySelector("body").style.overflow = "hidden";

};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.querySelector("body").style.overflow = "auto";
};
const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat("DE", {
    style: "currency",
    currency: "EGP",
  }).format(totalPrice);
  return price;
};
document.querySelector(".Search").classList.add("active");
let added = [];

async function getcard() {
  const response = await fetch("https://pharmalink.runasp.net/api/Cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  for (let i of data["cartItems"]) {
    added[i["medicineId"]] = 1;
  }
}
getcard();

const subsequence = function (str, subStr) {
  if (str == null) return false;
  if (subStr == "") return true;
  let c = 0;
  str = str.toLowerCase();
  subStr = subStr.toLowerCase();
  for (let i of str) {
    if (i == subStr[c]) c++;
    if (c == subStr.length) return true;
  }
  return false;
};
const search = document.querySelector(".search-btn");

const addtr = function (arr) {
  const boxes = document.querySelector("tbody");
  boxes.innerHTML = "";
  let c = 0;

  for (let i of arr) {
    let img =
      "https://pharmalink.runasp.net/" +
      i["imageUrl"].slice(i["imageUrl"].indexOf("uploads"));
    document.querySelector("tbody").insertAdjacentHTML(
      "beforeend",
      `<tr>
            <td>${i["medicineName"]}</td>
            <td> <a href="profile-company.html" title="Go to profile" class='link${c}'>${i["companyName"]
      }</a></td>
            <td>${createPrice(i["price"])}</td>
            <td>${i["inStock"] > 0 ? i["inStock"] : "Not available"}</td>
            <td>
            <button class="button" type="button" id='product-${c}'>
            <span class="button__text">+</span>
            <span class="button__icon"><svg class="svg" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg></span>
            </button>
            <td>
            <img src="${img}" alt="Image" id="img-${c++}" />
            </td>
            </tr>`
    );
  }
};
let arr = [],
  arrMedicine = [];

const updatelist = function () {
  const medicine = document.querySelector(".search-medicine").value;
  const company = document.querySelector(".search-company").value;
  arr = [];
  for (let i of arrMedicine) {
    if (
      subsequence(i["medicineName"], medicine) &&
      subsequence(i["companyName"], company)
    ) {
      arr.push(i);
    }
  }
  arr.sort(
    (a, b) => {
      let available = 0;
      if (a['inStock'] && !b['inStock']) available = -1e5;
      else if (!a['inStock'] && b['inStock']) available = 1e5;
      return available + (medicine ? a["medicineName"].length - b["medicineName"].length : 0) +
        (company ? a["companyName"].length - b["companyName"].length : 0);
    });
  addtr(arr);
  for (let i = 0; i < arr.length; i++) {
    document
      .querySelector(`#product-${i}`)
      .addEventListener("click", function () {
        if (added[arr[i]["id"]]) {
          showNotification("the product already added", 2);
        } else if (arr[i]["inStock"] > 0) addCart(i);
        else {
          showNotification("the product not available", 0);
        }
      });
    document.querySelector(`.link${i}`).addEventListener("click", function () {
      localStorage.setItem("userName", arr[i]["companyUserName"]);
    });
    const item = document.querySelector(`#img-${i}`);
    const head = document.querySelector(".name-med");
    const body = document.querySelector(".description-med");

    item.addEventListener('click', function () {
      head.textContent = arr[i]["medicineName"];
      body.textContent = arr[i]["description"];
      openModal();
    });
    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

  }
};

async function getMedicine() {
  const response = await fetch("https://pharmalink.runasp.net/api/Medicine", {
    method: "GET",
  });
  arrMedicine = await response.json();
  updatelist();
}

getMedicine();
const medicine = document.querySelector(".search-medicine");
const company = document.querySelector(".search-company");

medicine.addEventListener("input", function () {
  updatelist();
});
company.addEventListener("input", function () {
  updatelist();
});
