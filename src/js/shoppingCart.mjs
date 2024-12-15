import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default function shoppingCart() {
  const cartItems = getLocalStorage("so-cart");
  const outputEl = document.querySelector(".product-list");
  renderListWithTemplate(cartItemTemplate, outputEl, cartItems);
}

// generates HTML for a single cart item.
function cartItemTemplate(item) {
  if (item.FinalPrice < item.SuggestedRetailPrice) {
    const discount =
      (item.SuggestedRetailPrice - item.FinalPrice) /
      item.SuggestedRetailPrice;
      return `
      <li id="${item.Id}" class="cart-card divider">
        <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
          <img 
          src="${item.Color.ColorPreviewImageSrc}" 
          alt="${item.Name}" 
          />
        </a>
        <a href="#">
          <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Color?.ColorName}</p>
        <p class="cart-card__quantity">qty: ${item.Quantity}</p>
        <p class="cart-card__price"><span class="current-price">\$${item.FinalPrice.toFixed(2)}</span>
        <span class="original-price">\$${item.SuggestedRetailPrice.toFixed(2)}</span></p>
        <button type="button" class="remove_item" data-id="${item.Id}">X</button>
      </li>`;
  } else
    return `
    <li id="${item.Id}" class="cart-card divider">
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img 
        src="${item.Color.ColorPreviewImageSrc}" 
        alt="${item.Name}" 
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Color?.ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button type="button" class="remove_item" data-id="${item.Id}">X</button>
    </li>`;
}
