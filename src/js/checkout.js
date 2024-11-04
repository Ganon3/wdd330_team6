import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

checkoutProcess.init("so-cart", ".checkout-summary");

document
  .querySelector("#zip") // this is why it appears at zip
  .addEventListener(
    "blur",
    checkoutProcess.calculateOrdertotal.bind(checkoutProcess)
  );

document.forms["checkout"].addEventListener("submit", (e) => {
  e.preventDefault();
  // e.target would contain our form in this case
  checkoutProcess.checkout(e.target);
});
