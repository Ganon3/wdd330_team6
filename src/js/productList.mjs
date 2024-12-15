import { getProductsByCategory } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";

// this is the template for rendering individual product cards
export function productCardTemplate(product) {
  if(product.FinalPrice < product.SuggestedRetailPrice){
    const discount = (product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice;
    return `
      <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
          <div class="sale-badge"><span class="sale-tag">SALE</span>
        <span class="discount-tag">${(discount*100).toFixed(0)}%</span></div>
          <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="product-card__price"><span class="current-price">\$${product.FinalPrice.toFixed(2)}</span>
        <span class="original-price">\$${product.SuggestedRetailPrice.toFixed(2)}</span></p>
        </a>
        <button class="quick-view-button" data-id="${product.Id}">Quick View</button>
      </li>
    `;

  } else {
    return `
      <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
        </a>
        <button class="quick-view-button" data-id="${product.Id}">Quick View</button>
      </li>
    `;
    
  }
}

// fetch products by category and render them
export async function productList(selector, category) {
  const el = document.querySelector(selector);
  const products = await getProductsByCategory(category);
  // render the list of products
  renderListWithTemplate(productCardTemplate, el, products); // bug
  // set the title for the category
  document.querySelector(".title").innerHTML = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  // return the products and the element for sorting
  return { products, el };
}

// sort products based on selected criteria
export function sortProducts(criteria, products, el) {
  if (criteria === "name") {
    products.sort((a, b) => a.Name.localeCompare(b.Name));
  } else if (criteria === "priceLowToHigh") {
    products.sort((a, b) => a.FinalPrice - b.FinalPrice);
  } else if (criteria === "priceHighToLow") {
    products.sort((a, b) => b.FinalPrice - a.FinalPrice);
  }

  // re-render the sorted products
  renderListWithTemplate(productCardTemplate, el, products);
}
