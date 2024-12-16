import { updateAuth } from "./auth.mjs";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// there is a console bug at line 46
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlString.join(""));
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback){
    callback(data);
  }
}

export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
    const html = await res.text();
    return html;
    }
  };
}

export async function loadHeaderFooter() {

  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");

  const header = document.getElementById("main-header");
  const footer = document.getElementById("main-footer");

  await renderWithTemplate(headerTemplateFn, header);
  await setupsearch();
  await renderWithTemplate(footerTemplateFn, footer);

  updateAuth();
}
export async function setupsearch() {
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
              event.preventDefault();
              let searchValue = search.value;
              if(searchValue) {
                 window.location.href = `/product-list/index.html?category=${searchValue}`
              }
          }
      });

  }
}
// this is here because it's used in the main, product and cart pages.
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart");
  const cartCountElement = document.querySelector("#cart-count");

  if (!cartItems || cartItems.length === 0) {
    cartCountElement.classList.add("hidden");
    return;
  }

  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];
  cartCountElement.textContent = cartArray.length;
  cartCountElement.classList.remove("hidden");
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function breadcrumbs(crumbs) {
  if(crumbs && crumbs.length > 0){
    const headDivider = document.getElementById("main-header")
    headDivider.insertAdjacentHTML("afterend", '<div class="divider" id="breadcrumbs"></div>');
    const crum = document.getElementById("breadcrumbs");
    let crumbHtml = ""
    for (let i = 0; i < crumbs.length; i++) {
      if(crumbHtml.length > 0) crumbHtml += " > "
      if(crumbs[i].location){
        crumbHtml += `<a href="${crumbs[i].location}"><span data-crumb=${i}>${crumbs[i].name}</span></a>`
      }else
        crumbHtml += `<span data-crumb=${i}>${crumbs[i].name}</span>`;
    }
    crum.innerHTML = crumbHtml;

  }
}