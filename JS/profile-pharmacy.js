let userName = localStorage.getItem("userName");
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
if (userName === null)
  userName = data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
else {
  const pass = document.querySelector(".pass");
  const editPhone = document.querySelector(".edit-phone");
  const editEmail = document.querySelector(".edit-about");
  const editPhoto = document.querySelector(".custom-file-upload");
  pass.classList.add("hidden");
  editPhone.classList.add("hidden");
  editEmail.classList.add("hidden");
  editPhoto.classList.add("hidden");
}
async function getUsers() {
  const response = await fetch(
    `https://pharmalink.runasp.net/api/profile/${userName}`,
    {
      method: "GET",
    }
  );
  const data = await response.json(); // تحويل الاستجابة إلى JSON
  document.querySelector("#ph-name").innerHTML = data.pharmacyName;
  document.querySelector("#dr-name").innerHTML = data.drName;
  document.querySelector("#email").innerHTML = data.pharmacyEmail;
  document.querySelector("#phone").innerHTML = data.pharmacyPhoneNumber;
  document.querySelector("#lic").innerHTML = data.pharmacyLicenseNumber;
  document.querySelector(
    "#address"
  ).innerHTML = `${data.city} / ${data.state} / ${data.street}`;
  document.querySelector(".about-content").innerHTML = data.aboutUs;
  let img;
  if (data["pharmacyImagePath"]) {
    img =
      "https://pharmalink.runasp.net/" +
      data["pharmacyImagePath"].slice(
        data["pharmacyImagePath"].indexOf("uploads")
      );
    document.querySelector(".profile-image").src = img;
  }
  return data;
}
data = getUsers();
let update = false;
