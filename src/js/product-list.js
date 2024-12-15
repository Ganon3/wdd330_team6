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
productList(".product-list", category).then((result) => {
  let count = document.querySelectorAll("li").length;
  breadcrumbs("Products", `${category.toUpperCase()} ${count}`);
  document.querySelector("#sortSelect").addEventListener("change", (e) => {
    const criteria = e.target.value;
    if(criteria) {
      sortProducts(criteria, result.products, result.el);
    }
  })
});

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});
