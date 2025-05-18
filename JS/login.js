"use strict";

// Password toggle
const eyeIcon = document.querySelector(".fa-eye-slash");
const passwordInput = document.querySelector('input[type="password"]');

eyeIcon.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  }
});

function login(event) {
  event.preventDefault();

  const userName = document.getElementById("userName").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  // Special case for admin
  // if (userName === "admin" && password === "Admin@123") {
  //   window.location.href = "company.html";
  //   return;
  // }

  // Use fetch instead of XMLHttpRequest
  fetch("https://pharmalink.runasp.net/api/account/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName,
      password,
      rememberMe,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      // Redirect based on role
      if (data.role === "Company") {
        window.location.href = "Orders.html";
      } else if (data.role === "Pharmacy") {
        window.location.href = "search.html";
      } else if (data.role === "Admin") {
        window.location.href = "request.html"; // fallback
        // console.log('hello');
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      alert("Login failed. Please try again.");
    });
}

document.getElementById("loginForm").addEventListener("submit", login);
