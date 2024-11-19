import { checkLogin } from "./auth.mjs";
import currentOrders from "../js/currentOrders.mjs";
import { loadHeaderFooter, updateCartCount, breadcrumbs } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
    breadcrumbs("Orders");
  });
});

const token = checkLogin();
currentOrders("#orders", token);
