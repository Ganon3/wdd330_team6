import { productList } from "./productList.mjs";
import { loadHeaderFooter, updateCartCount, breadcrumbs } from "./utils.mjs";

// this loads the updateCartCount after the content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    updateCartCount();
    // breadcrumbs("Main", {show: false});
  });
});

async function fetchAlerts() {
  try {
    const response = await fetch("/json/alerts.json");
    if (!response.ok) throw new Error("Failed to load alerts.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
}

async function displayAlerts() {
  const alerts = await fetchAlerts();

  if (!alerts.length) return;

  const alertSection = document.createElement("section");
  alertSection.classList.add("alert-list");

  alerts.forEach((alert) => {
    const alertParagraph = document.createElement("p");
    alertParagraph.textContent = alert.message;
    alertParagraph.style.backgroundColor = alert.background;
    alertParagraph.style.color = alert.color;
    alertParagraph.classList.add("alert-message");

    alertSection.appendChild(alertParagraph);
  });

  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.prepend(alertSection);
  } else {
    console.error("Main element not found!");
  }
}

document.addEventListener("DOMContentLoaded", displayAlerts);

// productList(".product-list", "tents");
