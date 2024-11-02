import{g as c,r as n,l as s,u as l,s as u}from"./utils-dac5d251.js";function d(){const t=c("so-cart"),e=document.querySelector(".product-list");n(i,e,t)}function i(t){return`
<li id="${t.Id}" class="cart-card divider">
  <a href="../product_pages/index.html?product=${t.Id}" class="cart-card__image">
    <img 
    src="${t.Image}" 
    alt="${t.Name}" 
    />
  </a>
  <a href="#">
    <h2 class="card__name">${t.Name}</h2>
  </a>
  <p class="cart-card__color">${t.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${t.Quantity}</p>
  <p class="cart-card__price">$${t.FinalPrice}</p>
  <button type="button" class="remove_item" data-id="${t.Id}">X</button>
</li>`}s().then(()=>{o()});function o(){const t=c("so-cart"),e=document.querySelector(".product-list");m(t,e)||(d(),p(),f(t),l())}function m(t,e){return t.length===0?(e.innerHTML="<li>Your cart is empty</li>",document.querySelector(".cart-total").textContent="Total: $0.00",document.querySelector(".cart-footer").classList.remove("show"),document.querySelector("#cart-count").style.display="none",!0):(document.querySelector("#cart-count").style.display="",!1)}function p(){document.querySelectorAll(".remove_item").forEach(t=>{t.onclick=()=>y(t.dataset.id)})}function y(t){const r=(c("so-cart")||[]).filter(a=>a.Id!==t);u("so-cart",r),o()}function f(t){const e=t.reduce((r,a)=>r+a.FinalPrice,0);document.getElementById("cart-total").textContent=e.toFixed(2),document.querySelector(".cart-footer").classList.add("show")}
