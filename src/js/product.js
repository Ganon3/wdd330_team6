import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { getParam } from "./utils.mjs";
import productDetails from "./productDetail.mjs";

const productId = getParam("product");
console.log(findProductById(productId));
productDetails(productId);

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // checks if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return;
  }

  // this is what adds the item to the cart
  const cartArray = [].concat(cartItems);
  
  // pull count and update
  document.querySelector("#cart-count").textContent = cartArray.length;
}

renderCartContents();
// add listener to Add to Cart button !! This line was broken

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
