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
if (type !== "Admin") location.href = '../home.html';

const validatePassword = function (password) {
  if (password.length < 8) {
    console.log(1);
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
document.querySelector(".company").classList.add("active");

document
  .getElementById("signupForm")
  .addEventListener("submit", async function register(event) {
    event.preventDefault();
    // Collect form values
    const form = event.target;
    const CompanyName = form.CompanyName.value.trim();
    const email = form.email.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value.trim();
    const street = form.street.value.trim();
    const userName = form.userName.value.trim();
    const password = form.password.value;
    const licenseNumber = form.licenseNumber.value.trim();
    const minPriceToMakeOrder = form.MinPriceToMakeOrder.value;
    if (!validatePassword(password)) return;
    // Disable submit button to prevent multiple submissions
    const submitButton = form.querySelector("button[type=submit]");

    try {
      const response = await fetch(
        "https://pharmalink.runasp.net/api/account/CompanyRegister",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: CompanyName,
            street,
            state,
            city,
            phoneNumber,
            email,
            password,
            licenseNumber,
            userName,
            minPriceToMakeOrder,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        showNotification("the email or password is used");
        return;
      }

      const data = await response.json();
      showNotification("Registration add!", true);
      form.reset(); // Reset form on success
    } catch (error) {
      showNotification("An error occurred. Please try again later.", false);
    }
  });

