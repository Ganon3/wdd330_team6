// import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProductsByCategory } from "../../js/externalServices.mjs";
import { renderListWithTemplate } from "../../js/utils.mjs";
import { productList, productCardTemplate, sortProducts } from "../../js/productList.mjs";

vi.mock("../../js/externalServices.mjs", () => ({
  getProductsByCategory: vi.fn(),
}));

vi.mock("../../js/utils.mjs", () => ({
  renderListWithTemplate: vi.fn(),
}));

describe("productCardTemplate", () => {
  // const { productCardTemplate } = require("../../js/productList.mjs");

  it("should render product card with a discount", () => {
    const product = {
      Id: "1",
      FinalPrice: 80,
      SuggestedRetailPrice: 100,
      Images: { PrimaryMedium: "image.jpg" },
      Name: "Product Name",
      Brand: { Name: "Brand" },
      NameWithoutBrand: "Product",
    };
    const result = productCardTemplate(product);
    expect(result).toContain(
      '<div class="sale-badge"><span class="sale-tag">SALE</span>'
    );
    expect(result).toContain('<span class="discount-tag">20%</span>');
    expect(result).toContain("Image of Product Name");
    expect(result).toContain('<span class="current-price">$80.00</span>');
    expect(result).toContain('<span class="original-price">$100.00</span>');
  });

  it("should render product card without a discount", () => {
    const product = {
      Id: "2",
      FinalPrice: 100,
      SuggestedRetailPrice: 100,
      Images: { PrimaryMedium: "image.jpg" },
      Name: "Product Name",
      Brand: { Name: "Brand" },
      NameWithoutBrand: "Product",
    };
    const result = productCardTemplate(product);
    expect(result).not.toContain('<div class="sale-badge">');
    expect(result).toContain("$100.00");
  });
});

describe("productList", () => {
  let selector;
  let category;
  let mockElement;

  beforeEach(() => {
    selector = "#product-list";
    category = "electronics";
    mockElement = document.createElement("div");
    document.body.innerHTML = `<div id="product-list"></div><div class="title"></div>`;
    document.querySelector(selector).appendChild(mockElement);

    getProductsByCategory.mockResolvedValue([
      {
        Id: "1",
        FinalPrice: 100,
        SuggestedRetailPrice: 150,
        Images: { PrimaryMedium: "image.jpg" },
        Name: "Product Name",
        Brand: { Name: "Brand" },
        NameWithoutBrand: "Product",
      },
    ]);
  });

  it("should fetch products and render them", async () => {
    const { products, el } = await productList(selector, category);
    expect(getProductsByCategory).toHaveBeenCalledWith(category);
    expect(renderListWithTemplate).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(HTMLElement),
      products
    );
    expect(el).toEqual(expect.any(HTMLElement));
  });

  it("should set the correct title", async () => {
    await productList(selector, category);
    expect(document.querySelector(".title").innerHTML).toBe("Electronics");
  });
});

describe("sortProducts", () => {
  let products;
  let el;

  beforeEach(() => {
    products = [
      { Name: "B Product", FinalPrice: 50 },
      { Name: "A Product", FinalPrice: 100 },
    ];
    el = document.createElement("div");
  });

  it("should sort products by name", () => {
    sortProducts("name", products, el);
    expect(products[0].Name).toBe("A Product");
    expect(renderListWithTemplate).toHaveBeenCalledWith(
      expect.any(Function),
      el,
      products
    );
  });

  it("should sort products by price low to high", () => {
    sortProducts("priceLowToHigh", products, el);
    expect(products[0].FinalPrice).toBe(50);
    expect(renderListWithTemplate).toHaveBeenCalledWith(
      expect.any(Function),
      el,
      products
    );
  });

  it("should sort products by price high to low", () => {
    sortProducts("priceHighToLow", products, el);
    expect(products[0].FinalPrice).toBe(100);
    expect(renderListWithTemplate).toHaveBeenCalledWith(
      expect.any(Function),
      el,
      products
    );
  });

  it("should not change products if criteria is unknown", () => {
    const initialProducts = [...products];
    sortProducts("unknown", products, el);
    expect(products).toEqual(initialProducts);
  });
});
