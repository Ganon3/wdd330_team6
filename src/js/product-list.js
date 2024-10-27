import productList from "./productList.mjs";
import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

const category = getParam("category");
productList(".product-list", category);
