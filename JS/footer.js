let footer = ``;
if (type === "Pharmacy")
  footer = `  <li><a href="search.html" class='Search'>Search</a></li>
                <li><a href="pharmacy_invoice.html" class='history'>History</a></li>
                <li><a href="Cart.html" class='cart'>Cart</a></li>`;
else if (type === "Company")
  footer = `<li><a href="Orders.html" class="orders">Orders</a></li>
              <li><a href="products.html" class="products">Product</a></li>`;
document.querySelector("body").insertAdjacentHTML(
  "beforeend",
  `<footer class="footer">
        <div class="footer-column">
            <h3>About Pharma Link</h3>
            <p>
            Pharma Link is dedicated to helping pharmacies access a wide network
            of medical suppliers with ease and confidence.
            </p>
        </div>
        <div class="footer-column">
            <h3>Quick Links</h3>
            <ul>
            <li><a href="home.html">Home</a></li>
            ${footer}
            </ul>
        </div>
        <div class="footer-column">
            <h3>Follow Us</h3>
            <div class="social-icons">
            <a href="https://www.facebook.com/mohmed.abd.el.naser.2025/" class="social-link" target='_blank'>
                <img src="images/facebook.svg" alt="Facebook" class="social-icon" />
            </a>
            <a href="http://x.com/Mo_Zakeer" class="social-link" target='_blank'>
                <img src="images/twitter (2).svg" alt="Twitter" class="social-icon" />
            </a>
        <a href="https://www.linkedin.com/in/mohamed-abdelnaser-899262289/" target='_blank' class="social-link" >
                <img src="images/LinkedIn_icon.svg" alt="LinkedIn" class="social-icon" />

            </a>
            </div>
        </div>
        <div class="footer-column contact-column">
            <h3>Contact Us</h3>
            <p>
            Email:
            <a href="mailto:pharmalink38@gmail.com">pharmalink38@gmail.com</a>
            </p>
            <p>Phone: <a href="tel:+1234567890">+201096809082</a></p>
        </div>
        <div class="copyright">© 2025 <span> PharmaLink</span> All rights reserved.</div>
    </footer>`
);
