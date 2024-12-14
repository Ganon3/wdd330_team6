import { setupCarousel } from "./carousel.mjs";
import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage, renderListWithTemplate } from "./utils.mjs";

let product = {};

export default async function productDetails(productId, selector) {
  // use findProductById to get the details for the current product. findProductById will return a promise! use await or .then() to process it
  // once we have the product details we can render out the HTML
  // add a listener to Add to Cart button
    product = await findProductById(productId);
    renderProductDetails();
    // document.getElementById("addToCart").addEventListener("click", addToCart);
    
  }

 function renderProductDetails() {
    document.querySelector("#productName").innerText = product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").innerText = product.NameWithoutBrand;
    if(product.Images.ExtraImages?.length > 0){
      document.querySelector("#productImage").remove()
      const images = product.Images.ExtraImages.concat([{Src: product.Images.PrimaryLarge, Title: product.Name}]);
      renderListWithTemplate(extraDetailSlide, document.querySelector("#extraImages"), images);
      setupCarousel();
    } else {
      document.querySelector("#productImage").src = product.Images.PrimaryLarge;
      document.querySelector("#productImage").alt = product.Name;
    }
    document.querySelector("#productFinalPrice").innerText = `${product.FinalPrice}\$ or ${(product.FinalPrice * .90).toFixed(2)}\$ with discount`;
    document.querySelector("#productColorName").innerText = product.Colors[0].ColorName;
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =product.DescriptionHtmlSimple;
    document.querySelector("#addToCart").dataset.id = product.Id;
}

function extraDetailSlide(item) {
  return `
  <div class="slide hidden"> 
        <img class="divider" src="${item.Src}" alt="${item.Title}" />
  </div>
        `;
}