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
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiODE1MDRhODYtMzcyZi00ZGVhLTg4MjMtNmRkNGM3Zjg4MTAyIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc0ODA4NjM1NywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMDQiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo0NDMwNCJ9.NNl6CPs3Gfx3WXADR-lEqDw-UYTlW6EaRrEmr81UrqA";
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
      console.log("Success:", data);
      showNotification("Registration add!", true);
      form.reset(); // Reset form on success
    } catch (error) {
      console.error("Error:", error.message);
      showNotification("An error occurred. Please try again later.", false);
    }
  });

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
