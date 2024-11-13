import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
import { getParam, updateCartCount, loadHeaderFoote, alertMessage } from "./utils.mjs";
import productDetails from "./productDetail.mjs";

// this loads the updateCartCount after the content is loaded
loadHeaderFooter().then(() => {
  updateCartCount();
});

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
    handleProductNotFound();
  }
}

function handleProductNotFound() {
  document.querySelector(".product-detail").innerHTML = `
    <p class="error-message">Sorry, the product you're looking for does not exist.</p>`;
  // ensure the Add to Cart button is hidden
  const addToCartBtn = document.getElementById("addToCart");
  addToCartBtn.classList.remove("show");
}
// this updates the cart-count
loadProductDetails().then(() => {
  updateCartCount();
});

// this may have to be moved to productDetail.mjs later - km
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
    alertMessage(`${product.NameWithoutBrand} added to cart!`);
  }

  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  alertMessage(`${product.NameWithoutBrand} added to cart!`);
  // after it pushes the item, it updates the count w/out refreshing
  updateCartCount();
}
