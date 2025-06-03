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
      if (rememberMe) localStorage.setItem("token", data.token);
      else sessionStorage.setItem("token", data.token);
      if (data.role === "Company") {
        window.location.href = "home.html";
      } else if (data.role === "Pharmacy") {
        window.location.href = "home.html";
      } else if (data.role === "Admin") {
        window.location.href = "home.html"; // fallback
        // console.log('hello');
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      showNotification("Invalid username or password", 0);
    });
}

document.getElementById("loginForm").addEventListener("submit", login);

// Message
function showNotification(message, ok = 2) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const closeButton = document.getElementById("notification-close");
  if (ok == 2)
    (message = "⚠️" + message),
      (notification.style.backgroundColor = " #C5C75D");
  else notification.style.backgroundColor = ok ? " #1bbb4b" : "#C91432";

  notificationMessage.textContent = message;

  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);

  closeButton.addEventListener("click", () => {
    notification.classList.add("hidden");
  });
}