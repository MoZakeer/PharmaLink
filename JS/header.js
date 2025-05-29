let ok = 0;
let ok2 = 0;
let token = localStorage.getItem("token") || sessionStorage.getItem("token");

let type = "";

const btnLogout = `
              <button class="Btn logout">
                <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div> 
              <div class="text-header logout">Logout</div>
            </button>`;

document
  .querySelector("head")
  .insertAdjacentHTML("afterbegin", `<link rel="icon" href="images/Icon.png">`);
if (token === null) {
  document.querySelector("body").insertAdjacentHTML(
    "afterbegin",
    `<header class="main-header">
    <div class="container">
      <a href="home.html" class='home'>
      <img src="images/logo.svg" alt="Logo" class="logo" />
      </a>

      <i class="fa-solid fa-bars menu-toggle"></i>

      <nav>
        <ul class="nav">
        <li><a class="home" href="home.html">Home</a></li>
        <li><a href="about.html"  class="about-us">About</a></li>
        <li class="mobile-only user-profile-header">
        <a href="login.html">Login</a> </li>
          <li class="mobile-only "><a href="reg.html">Resgister</a></li>
        </ul>
      </nav>

      <ul class="sign">
        <li>
          <a href="login.html" class="login">
            <span>Login</span>
          </a>
        </li>
        <li>
         <a href='reg.html' class="register">Register</a>
        </li>
      </ul>
    </div>
  </header>`
  );
} else {
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
  type = data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (type === "Pharmacy") {
    document.querySelector("body").insertAdjacentHTML(
      "afterbegin",
      `<header class="main-header">
    <div class="container">
      <a href="home.html"><img src="images/logo.svg" alt="Logo" class="logo" /></a>

      <i class="fa-solid fa-bars menu-toggle"></i>

      <nav>
        <ul class="nav">
          <li class="mobile-only user-profile-header">
          <a href="profile-pharmacy.html">Profile</a>
          </li>
          <li><a href="home.html" class='home'>Home</a></li>
          <li><a href="search.html" class='Search'>Search</a></li>
          <li><a href="pharmacy_invoice.html" class='history'>History</a></li>
          <li><a href="Cart.html" class='cart'>Cart</a></li>
          <li ><a href="about.html" class="about-us">About</a></li>
          <li class="mobile-only logout"><a href="#">Logout</a></li>
        </ul>
      </nav>

      <ul class="sign">
        <li>
          <a href="profile-pharmacy.html" class="user-profile-header">
            <i class="fa-regular fa-circle-user"></i>
            <span>Profile</span>
          </a>
        </li>
        <li>
         <a class="logout"> ${btnLogout} </a>
        </li>
      </ul>
    </div>
  </header>`
    );
  } else if (type === "Company") {
    document.querySelector("body").insertAdjacentHTML(
      "afterbegin",
      `<header class="main-header">
  <div class="container">
    <a href="home.html"><img src="images/logo.svg" alt="Logo" class="logo" /></a>

    <i class="fa-solid fa-bars menu-toggle"></i>

    <nav>
      <ul class="nav">
        <li class="mobile-only user-profile-header"><a href="profile-company.html">Profile</a></li>
        <li><a href="home.html" class='home'>Home</a></li>
        <li><a href="Orders.html" class="orders">Orders</a></li>
        <li><a href="products.html" class="products">Product</a></li>
        <li ><a href="about.html"  class="about-us">About</a></li>
        <li class="mobile-only logout"><a href="#">Logout</a></li>
      </ul>
    </nav>

    <ul class="sign">
      <li>
        <a href="profile-company.html" class="user-profile-header">
          <i class="fa-regular fa-circle-user"></i>
          <span>Profile</span>
        </a>
      </li>
      <li>
       <a class="logout"> ${btnLogout} </a>
      </li>
    </ul>
  </div>
</header>`
    );
  } else {
    document.querySelector("body").insertAdjacentHTML(
      "afterbegin",
      `<header class="main-header">
  <div class="container">
    <a href="home.html">
    <img src="images/logo.svg" alt="Logo" class="logo" />
    </a>

    <i class="fa-solid fa-bars menu-toggle"></i>

    <nav>
      <ul class="nav">
        <li><a href="home.html" class='home'>Home</a></li>
        <li><a href="company.html" class="company">Company</a></li>
        <li><a href="request.html" class="requests">Requests</a></li>
        <li><a href="about.html"  class="about-us">About</a></li>
        <li class="mobile-only logout"><a href="#">Logout</a></li>
      </ul>
    </nav>

    <ul class="sign">
      <li>
        <a class="logout"> ${btnLogout} </a>  
    </li>
    </ul>
  </div>
</header>`
    );
  }
  const btnLogoutEl = document.querySelectorAll(".logout");
  for (const logout of btnLogoutEl) {
    logout.addEventListener("click", function (e) {
      console.log(e.target);
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "home.html";
    });
  }
}

document.querySelector("header").insertAdjacentHTML(
  "beforeend",
  `<div id="notification" class="notification hidden">
        <p id="notification-message">Your item has been added to the cart!</p>
        <button id="notification-close" class="notification-close">✖</button>
    </div>
    <div id="descriptionBox" class="hidden"></div>`
);
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
/////////////////////////////////////////////
const menuToggle = document.querySelector(".main-header .menu-toggle");
const nav = document.querySelector(".main-header nav");
const body = document.querySelector("body");

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

nav.addEventListener("click", (e) => {
  e.stopPropagation();
});

body.addEventListener("click", () => {
  if (nav?.classList.contains("active")) {
    nav.classList.remove("active");
  }
});
let message = localStorage.getItem("message");
if (message) {
  showNotification(message, true);
  localStorage.removeItem("message");
}
