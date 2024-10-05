import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // I revamped my empty cart error code - kim 10/4
  if (checkIfCartIsEmpty(cartItems)) {
    return;
  }

  function checkIfCartIsEmpty(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      document.querySelector(".product-list").innerHTML =
        "<li>Your cart is empty</li>";
      document.querySelector("#cart-count").textContent = 0;
      return true;
    }
    return false;
  }
  
  const cartArray = [].concat(cartItems);
  document.querySelector("#cart-count").textContent = cartArray.length; // this is suppose to update the cart count but isn't? km
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li id="${item.Brand.Id}" class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button type='button' class="remove_item" onclick="remove_li('${item.Brand.Id}')">X</button>
  </li>`;

  return newItem;
}

function remove_li(id) {
  let ul = document.querySelector(".product-list");
  let li = document.getElementById(id);
  ul.remove(li);
}

renderCartContents();