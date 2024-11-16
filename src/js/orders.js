import { checkLogin } from "./auth.mjs";
import currentOrders from "../js/currentOrders.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

const token = checkLogin();
currentOrders("#orders", token);
