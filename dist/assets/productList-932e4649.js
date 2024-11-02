import{g as c}from"./productData-98a3baef.js";import{r as n}from"./utils-dac5d251.js";function s(a){return`<li class="product-card">
    <a href="/product_pages/index.html?product=${a.Id}">
    <img
      src="${a.Image}"
      alt="Image of ${a.Name}"
    />
    <h3 class="card__brand">${a.Brand.Name}</h3>
    <h2 class="card__name">${a.NameWithoutBrand}</h2>
    <p class="product-card__price">$${a.FinalPrice}</p></a>
  </li>`}async function o(a,e){const r=document.querySelector(a),t=await c(e);n(s,r,t),document.querySelector(".title").innerHTML=e}export{o as p};
