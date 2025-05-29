"use strict";
const btnConfirm = document.querySelector(".btn-confirm");
const params = new URLSearchParams(window.location.search);
let email = params.get("email");
const confirmEmailURL =
  "https://pharmalink.runasp.net/api/requests/ConfirmEmail";

async function conFirmEmail(url, email) {
  const formData = new FormData();
  formData.append("email", email);

  const response = await fetch(url, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Confirmation failed: ${errorMessage}`);
  }
}
btnConfirm.addEventListener("click", async function (e) {
  try {
    console.log(email);
    await conFirmEmail(confirmEmailURL, email);
  } catch (error) {
    alert(error);
  }
  window.location.href = "home.html";
});
