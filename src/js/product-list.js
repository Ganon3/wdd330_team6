import productList from "./productList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import { sortProducts } from "./productList.mjs";

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});
// this was wrong before "category" didn't need "" to return the productList
const category = getParam("category");

// Fetch products and render them
productList(".product-list", category).then(({ products, el }) => {
  if (products && el) {
    // attach event listener for sorting after the products are rendered
    document.getElementById("sortSelect").addEventListener("change", (event) => {
      sortProducts(event.target.value, products, el); // pass products and el to sort function
    });
  }
});