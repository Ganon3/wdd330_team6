import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
} from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    renderCartContents();
  });
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");

  if (checkIfCartIsEmpty(cartItems, productList)) return;

  shoppingCart();
  attachRemoveItemHandlers();
  updateCartTotal(cartItems);
  updateCartCount();
}

function checkIfCartIsEmpty(cartItems, productList) {
  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty</li>";
    document.querySelector(".cart-total").textContent = "Total: $0.00";
    document.querySelector(".cart-footer").classList.remove("show");
    document.querySelector("#cart-count").style.display = "none";
    return true;
  }
  document.querySelector("#cart-count").style.display = "";
  return false;
}

function attachRemoveItemHandlers() {
  document.querySelectorAll(".remove_item").forEach((button) => {
    button.onclick = () => removeItemFromCart(button.dataset.id);
  });
}

function removeItemFromCart(itemId) {
  const cartItems = getLocalStorage("so-cart") || [];
  const updatedCartItems = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage("so-cart", updatedCartItems);
  renderCartContents();
}

function updateCartTotal(cartArray) {
  const total = cartArray.reduce((sum, item) => sum + item.FinalPrice, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.querySelector(".cart-footer").classList.add("show");
}
