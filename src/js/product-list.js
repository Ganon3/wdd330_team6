import productList from "./productList.mjs";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});
// this was wrong before "category" didn't need "" to return the productList
const category = getParam("category");
productList(".product-list", category);