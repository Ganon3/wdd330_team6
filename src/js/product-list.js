import {productList} from "./productList.mjs";
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
  if (result.products && result.el) {
    //adding quick view event listener
    attachQuickViewListeners(result.products);
    let count = document.querySelectorAll("li").length;
    breadcrumbs("Products", {category: `${category.toUpperCase()} ${count}`});
    document.querySelector("#sortSelect").addEventListener("change", (e) => {
      const criteria = e.target.value;
      if(criteria) {
        sortProducts(criteria, result.products, result.el);
        attachQuickViewListeners(result.products);
      }
    })
  }
});

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
  });
});

function attachQuickViewListeners(products) {
  const quickViewButtons = document.querySelectorAll(".quick-view-button");
  quickViewButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      const product = products.find((p) => p.Id === productId);
      openQuickViewModal(product);
    });
  });
}
// open the modal with product details
function openQuickViewModal(product) {
  // set content
  document.getElementById("modal-product-name").innerText = product.Name;
  document.getElementById("modal-product-image").src =
    product.Images.PrimaryLarge;
  document.getElementById("modal-product-description").innerText =
    product.Description || "No description available.";
  document.getElementById(
    "modal-product-price"
  ).innerText = `$${product.FinalPrice}`;

  // show the modal
  const modal = document.getElementById("quick-view-modal");
  modal.style.display = "block";

  // close modal when button clicked
  document.getElementById("close-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // close the modal if the user clicks outside of modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
