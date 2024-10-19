import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default function shoppingCart() {
  const cartItems = getLocalStorage("so-cart");
  const outputEl = document.querySelector(".product-list");
  renderListWithTemplate(cartItemTemplate, outputEl, cartItems);
}

// generates HTML for a single cart item.
function cartItemTemplate(item) {
    const newItem = `
<li id="${item.Id}" class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img 
    src="${item.Image}" 
    alt="${item.Name}" 
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button type='button' class="remove_item" onclick="remove_li('${item.Id}')">X</button>
</li>`;

    return newItem
}