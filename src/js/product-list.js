import productList from "./productList.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

productList(".product-list", "tents");