import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { getParam } from "./utils.mjs";
import productDetails from "./productDetail.mjs";

// added Team Activity 2
const productId = getParam("product");

// this fixes the error handling for the product detail page
async function loadProductDetails() {
  try {
    const product = await findProductById(productId);

    if (!product) {
      handleProductNotFound();
      return;
    }
    // this is from the original Team Activity 2
    productDetails(productId);

    const addToCartBtn = document.getElementById("addToCart");
    addToCartBtn.classList.add("show");
    addToCartBtn.addEventListener("click", () => addProductToCart(product));
    } catch (error) {
      // console.error("Error loading product details:", error);
      handleProductNotFound();
    }
}

function handleProductNotFound() {
  // show a user-friendly error message
  document.querySelector(".product-detail").innerHTML = `
    <p class="error-message">Sorry, the product you're looking for does not exist.</p>
  `;

  // ensure the Add to Cart button is hidden
  const addToCartBtn = document.getElementById("addToCart");
  addToCartBtn.classList.remove("show");
}

loadProductDetails();

// function to add the product to the cart
function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  // this ensures cart contents are updated
  renderCartContents();
}

// this will update the cart contents whenever the page loads
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!cartItems || cartItems.length === 0) {
    return;
  }

  const cartArray = [].concat(cartItems);
  document.querySelector("#cart-count").textContent = cartArray.length;
  // this ensures cart contents are updated
  renderCartContents();
}

renderCartContents();