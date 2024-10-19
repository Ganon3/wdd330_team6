import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { getParam } from "./utils.mjs";
import productDetails from "./productDetail.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

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
// this function is called when the Add to Cart button is clicked and will add the product to the cart more than once
function addProductToCart(product) {
  product.Quantity = 1;

  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  } else {
    const existingProduct = cartItems.find((item) => item.Id === product.Id);
    if (existingProduct) {
      cartItems = cartItems.filter((item) => item.Id !== product.Id);
      product.Quantity = (existingProduct.Quantity ?? 1) + 1;
    }
  }

  cartItems.push(product);

  setLocalStorage("so-cart", cartItems);
  // this ensures cart contents are updated
  renderCartContents();
}

// this will update the cart contents whenever the page loads
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!cartItems || cartItems.length === 0) {
    document.querySelector("#cart-count").style.display = "none";
    return;
  }

  const cartArray = [].concat(cartItems);
  document.querySelector("#cart-count").textContent = cartArray.length;
  document.querySelector("#cart-count").style.display = "";
}

renderCartContents();
