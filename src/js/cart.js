import { getLocalStorage } from "./utils.mjs";

// renders the contents of the cart by fetching cart items from local storage.
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // check if the cart is empty and display an appropriate message if it is.
  if (checkIfCartIsEmpty(cartItems)) {
    return;
  }

  // ensure cartItems is an array for consistency.
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  // update the cart count display.
  document.querySelector("#cart-count").textContent = cartArray.length;

  // generate the HTML for each cart item and insert it into the product list.
  const htmlItems = cartArray.map(cartItemTemplate).join("");
  document.querySelector(".product-list").innerHTML = htmlItems;

  updateCartTotal(cartArray);
}

// checks if the cart is empty and updates the display accordingly.
function checkIfCartIsEmpty(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<li>Your cart is empty</li>";
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

// generates HTML for a single cart item.
function cartItemTemplate(item) {
  return `
    <li id="${item.Brand.Id}" class="cart-card divider">
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
}

renderCartContents();
