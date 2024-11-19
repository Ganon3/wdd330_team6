import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import { login } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

const redirect = getParam("redirect");

document.querySelector("#loginButton").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  login({ email, password }, redirect);
});
