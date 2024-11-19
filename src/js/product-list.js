import productList from "./productList.mjs";
import {
  getParam,
  loadHeaderFooter,
  updateCartCount,
  breadcrumbs,
} from "./utils.mjs";
import { sortProducts } from "./productList.mjs";

// this was wrong before "category" didn't need "" to return the productList
const category = getParam("category");
productList(".product-list", category).then(() => {
  let count = document.querySelectorAll("li").length;
  breadcrumbs("Products", `${category.toUpperCase()} ${count}`);
});

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});
