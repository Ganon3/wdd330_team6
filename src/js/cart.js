import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";
import ShoppingCart from "./shoppingCart.mjs";

loadHeaderFooter();
shoppingCart();

// renders the contents of the cart by fetching cart items from local storage.
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // check if the cart is empty and display an appropriate message if it is.
  if (checkIfCartIsEmpty(cartItems)) {
    // this ensures cart contents are updated
    document.querySelector("#cart-count").style.display = "none";
    return;
  }

  // ensure cartItems is an array for consistency.
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  // update the cart count display.
  document.querySelector("#cart-count").textContent = cartArray.length;
  // this ensures cart contents are updated
  document.querySelector("#cart-count").style.display = "";

  // call the shoppingCart module to render the cart items
  ShoppingCart(cartArray);

  // update the total price of the cart.
  updateCartTotal(cartArray);
}

// checks if the cart is empty and updates the display accordingly.
function checkIfCartIsEmpty(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<li>Your cart is empty</li>";
    document.querySelector(".cart-total").textContent = "Total: $0.00";
    document.querySelector(".cart-footer").classList.remove("show");
    return true;
  }
  return false;
}

// updates the total price of items in the cart.
function updateCartTotal(cartArray) {
  const total = cartArray.reduce((sum, item) => sum + item.FinalPrice, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.querySelector(".cart-footer").classList.add("show");
}

renderCartContents();
