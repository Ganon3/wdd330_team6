import { loadHeaderFooter, updateCartCount, breadcrumbs } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
  breadcrumbs([{name:"Chechout"}]);
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

  var myForm = document.forms[0];
  var chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) checkoutProcess.checkout(e.target); // e.target would contain our form in this case
});
