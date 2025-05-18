if (localStorage.getItem("rating")) {
  showNotification("thank you for your rating!", 1);
  localStorage.removeItem("rating");
}
let userName = localStorage.getItem("userName"),
  pharmacy = 0;
const createPrice = function (totalPrice) {
  const price = new Intl.NumberFormat("DE", {
    style: "currency",
    currency: "EGP",
  }).format(totalPrice);
  return price;
};
function parseJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
let data = parseJWT(token);
if (userName === null) {
  userName = data["https://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const ratingContainer = document.querySelector(".rating-container");
  const commentForm = document.querySelector(".comment-form");
  ratingContainer.classList.add("hidden");
  commentForm.innerHTML = "";
} else {
  pharmacy = 1;
  const pass = document.querySelector(".pass");
  const editPhone = document.querySelector(".edit-phone");
  const editEmail = document.querySelector(".edit-about");
  const editPrice = document.querySelector(".edit-mn-price");
  const editPhoto = document.querySelector(".custom-file-upload");
  pass.classList.toggle("hidden");
  editPhone.classList.toggle("hidden");
  editEmail.classList.toggle("hidden");
  editPrice.classList.toggle("hidden");
  editPhoto.classList.toggle("hidden");
}

let id = 0;

async function getUsers() {
  const response = await fetch(
    `https://pharmalink.runasp.net/api/profile/${userName}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  let img;
  if (data["companyImagePath"]) {
    img =
      "https://pharmalink.runasp.net/" +
      data["companyImagePath"].slice(
        data["companyImagePath"].indexOf("uploads")
      );
    document.querySelector(".profile-image").src = img;
  }
  document.querySelector("#comp-name").innerHTML = data.companyName;
  document.querySelector("#email").innerHTML = data.companyEmail;
  document.querySelector("#phone").innerHTML = data.companyPhoneNumber;
  document.querySelector("#lic").innerHTML = data.companyLicenseNumber;
  document.querySelector(
    "#address"
  ).innerHTML = `${data.city} / ${data.state} / ${data.street}`;
  document.querySelector(
    ".current-rate"
  ).innerHTML = `⭐${data.companyRating.toFixed(1)}`;
  document.querySelector(".num-rate").innerHTML = `${data.totalReviws} rating`;
  document.querySelector("#min-price").innerHTML = `${createPrice(
    data.minPriceToOrder
  )}`;
  document.querySelector(".about-content").innerHTML = data.aboutUs;
  document.querySelector(".comments-list").innerHTML = "";
  for (let i of data.reviews) {
    let name = i.reviewerName;
    let comment = i.comment;
    if (i.comment === "" || i.comment === "string") continue;
    document.querySelector(".comments-list").insertAdjacentHTML(
      "afterbegin",
      `<div class="item">
                <h3>${name} :</h3>
                <p>${comment}</p>
            </div>`
    );
  }
  id = data.id;
  if (pharmacy) can();
  return data;
}
getUsers();
let update = false;
