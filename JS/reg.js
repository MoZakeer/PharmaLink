// Toggle for password
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  });

// Toggle for confirm password
document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const icon = this.querySelector("i");

    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      confirmPasswordInput.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  });

const validatePassword = function (password, confirmPassword) {
  if (password !== confirmPassword) {
    return showNotification("passwords are not equal!", false);
  } else if (password.length < 8) {
    return showNotification(
      "password must be at least 8 characters long!",
      false
    );
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
    return showNotification(
      "password must contain at least one letter, one number and one special character!",
      false
    );
  }
  return true;
};

async function register(event) {
  event.preventDefault();

  // Get form values
  const form = document.getElementById("signupForm");
  const pharmacyName = form.pharmacyName.value.trim();
  const doctorName = form.doctorName.value.trim();
  const email = form.email.value.trim();
  const phoneNumber = form.phoneNumber.value.trim();
  const city = form.city.value.trim();
  const state = form.state.value.trim();
  const street = form.street.value.trim();
  const userName = form.userName.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const licenseNumber = form.licenseNumber.value.trim();
  const website = form.website.value.trim();
  if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 11) {
    showNotification("the phone number is not valid", false);
    return;
  }
  if (!validatePassword(password, confirmPassword)) return;
  // Prepare request body
  const bodyParams = {
    name: pharmacyName,
    street,
    state,
    city,
    phoneNumber,
    email,
    password,
    licenseNumber,
    userName,
    drName: doctorName,
    pdfURL: website, // Clarify if this should be website or actual PDF URL
  };

  try {
    const response = await fetch(
      "https://pharmalink.runasp.net/api/requests/Register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyParams),
      }
    );

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem(
        "message",
        "Your request has been sent Please Confirm Your Emali"
      );
      window.location.href = "home.html";
    } else {
      showNotification("the email or username is used", false);
    }
  } catch (error) {
    showNotification("An error occurred. Please try again later.", false);
  }
}

document.querySelector("#signupForm").addEventListener("submit", register);

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
  }, 5000);

  closeButton.addEventListener("click", () => {
    notification.classList.add("hidden");
  });
}
