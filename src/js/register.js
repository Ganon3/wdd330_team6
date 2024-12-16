import {
  getParam,
  loadHeaderFooter,
  updateCartCount,
  breadcrumbs,
} from "./utils.mjs";
import { login, signup } from "./auth.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
    breadcrumbs([{name:"Register"}]);
    document.querySelector("#loginButton").addEventListener("click", (e) => {
      e.preventDefault();
      window.location = "/login/index.html";
    })
  });
});

// const redirect = getParam("redirect");

document.querySelector("#registerButton").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const address = document.querySelector("#address").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  signup({ name, address, email, password }, "/");
});
