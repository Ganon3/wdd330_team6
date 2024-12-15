//javascript
import { describe, it, expect, vi, afterEach } from "vitest";
import { findProductById } from "../../js/externalServices.mjs";
import productDetails from "../../js/productDetail.mjs"; // assuming the main function is exported from index.mjs
import { setLocalStorage, getLocalStorage } from "../../js/utils.mjs";

// Mock external modules and DOM
vi.mock("../../js/externalServices.mjs");
vi.mock("../../js/utils.mjs");
const mockDom = {};
global.window = {
  scrollTo: vi.fn(),
};
global.document = {
  getElementById: vi.fn().mockImplementation((id) => {
    const element = {
      addEventListener: vi.fn(),
      dataset: {},
    };
    return element;
  }),
  querySelector: vi.fn().mockImplementation((selector) => {
    if (!mockDom[selector]) {
      mockDom[selector] = {
        innerText: "",
        src: "",
        alt: "",
        innerHTML: "",
        dataset: { id: "" },
      };
    }
    return mockDom[selector];
  }),
};

describe("productDetails", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should correctly render product details", async () => {
    const productMock = {
      Brand: { Name: "Nikon" },
      NameWithoutBrand: "D3500 DSLR",
      Images: { PrimaryLarge: "image-url.jpg" },
      Name: "Nikon D3500 DSLR",
      FinalPrice: 500,
      Colors: [{ ColorName: "Black" }],
      DescriptionHtmlSimple: "<p>Excellent camera for beginners...</p>",
      Id: 12345,
    };
    findProductById.mockResolvedValue(productMock);

    await productDetails(12345);

    expect(findProductById).toHaveBeenCalledWith(12345);
    expect(document.querySelector).toHaveBeenCalledWith("#productName");
    expect(document.querySelector("#productName").innerText).toBe("Nikon");
    expect(document.querySelector("#productNameWithoutBrand").innerText).toBe(
      "D3500 DSLR"
    );
    expect(document.querySelector("#productImage").src).toBe("image-url.jpg");
    expect(document.querySelector("#productImage").alt).toBe(
      "Nikon D3500 DSLR"
    );
    expect(document.querySelector("#productFinalPrice").innerText).toBe("$500");
    expect(document.querySelector("#productColorName").innerText).toBe("Black");
    expect(
      document.querySelector("#productDescriptionHtmlSimple").innerHTML
    ).toBe("<p>Excellent camera for beginners...</p>");
    expect(document.querySelector("#addToCart").dataset.id).toBe(12345);
    // expect(document.getElementById('addToCart').addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it("should handle failures when product is not found", async () => {
    findProductById.mockRejectedValue(new Error("Product not found"));

    await expect(productDetails("wrong-id")).rejects.toThrow(
      "Product not found"
    );

    expect(findProductById).toHaveBeenCalledWith("wrong-id");
    expect(
      document.getElementById("addToCart").addEventListener
    ).not.toHaveBeenCalled();
  });
});
//
