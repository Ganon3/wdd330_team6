import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
  breadcrumbs,
} from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";

// this loads the updateCartCount after the content is loaded
// took out event listener because it is stable now - km
loadHeaderFooter().then(() => {
  renderCartContents();
  breadcrumbs("Carts");
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

// this is the remove handler for the button
function attachRemoveItemHandlers() {
  document.querySelectorAll(".remove_item").forEach((button) => {
    button.onclick = () => removeItemFromCart(button.dataset.id);
  });
}
// this removes the item from the cart and sets it to the local storage
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
