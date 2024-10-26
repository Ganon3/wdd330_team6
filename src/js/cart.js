import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
} from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";

// this loads the updateCartCount after the content is loaded
// took out event listener because it is stable now - km
loadHeaderFooter().then(() => {
  renderCartContents();
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

// generates HTML for a single cart item.
function cartItemTemplate(item) {
        // this logic it to check if the cart is empty and display an appropriate message if it is.

  return `
    <li id="${item.Id}" class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button type='button' class="remove_item" onclick="remove_li('${item.Id}')">X</button>
    </li>`;
}

renderCartContents();
