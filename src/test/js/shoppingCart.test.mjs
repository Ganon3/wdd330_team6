// import { describe, it, expect, beforeEach, vi } from 'vitest';
import shoppingCart from "../../js/shoppingCart.mjs";
import { getLocalStorage, renderListWithTemplate } from "../../js/utils.mjs";

vi.mock("../../js/utils.mjs", () => ({
  getLocalStorage: vi.fn(),
  renderListWithTemplate: vi.fn(),
}));

describe("shoppingCart", () => {
  let mockCartItems = [];

  beforeEach(() => {
    mockCartItems = [
      {
        Id: "1",
        Name: "Product A",
        Quantity: 2,
        FinalPrice: 20.99,
        SuggestedRetailPrice: 25.0,
        Color: { ColorName: "Red", ColorPreviewImageSrc: "red.png" },
      },
      {
        Id: "2",
        Name: "Product B",
        Quantity: 1,
        FinalPrice: 30.0,
        SuggestedRetailPrice: 30.0,
        Color: { ColorName: "Blue", ColorPreviewImageSrc: "blue.png" },
      },
    ];
    getLocalStorage.mockImplementation(() => mockCartItems);
    document.body.innerHTML = '<div class="product-list"></div>';
  });

  it('should call getLocalStorage with "so-cart"', () => {
    shoppingCart();
    expect(getLocalStorage).toHaveBeenCalledWith("so-cart");
  });

  it("should call renderListWithTemplate with correct parameters", () => {
    shoppingCart();
    const outputEl = document.querySelector(".product-list");
    expect(renderListWithTemplate).toHaveBeenCalledWith(
      expect.any(Function),
      outputEl,
      mockCartItems
    );
  });

  it("should render items with a discount correctly", () => {
    const templateFunc = renderListWithTemplate.mock.calls[0][0];
    const html = templateFunc(mockCartItems[0]);
    expect(html).toContain('<span class="current-price">$20.99</span>');
    expect(html).toContain('<span class="original-price">$25.00</span>');
    expect(html).toContain('<p class="cart-card__color">Red</p>');
    expect(html).toContain('<p class="cart-card__quantity">qty: 2</p>');
  });

  it("should render items without a discount correctly", () => {
    const templateFunc = renderListWithTemplate.mock.calls[0][0];
    const html = templateFunc(mockCartItems[1]);
    expect(html).toContain('<p class="cart-card__price">$30.00</p>');
    expect(html).toContain('<p class="cart-card__color">Blue</p>');
    expect(html).toContain('<p class="cart-card__quantity">qty: 1</p>');
  });

  it("should handle edge case with missing color information", () => {
    const edgeCaseItem = {
      Id: "3",
      Name: "Product C",
      Quantity: 1,
      FinalPrice: 10.0,
      SuggestedRetailPrice: 10.0,
      Color: null,
    };
    const templateFunc = renderListWithTemplate.mock.calls[0][0];
    const html = templateFunc(edgeCaseItem);
    expect(html).toContain('<p class="cart-card__color"></p>'); // Should handle null color
  });

  it("should handle edge case with zero quantity", () => {
    const edgeCaseItem = {
      Id: "4",
      Name: "Product D",
      Quantity: 0,
      FinalPrice: 15.0,
      SuggestedRetailPrice: 15.0,
      Color: { ColorName: "Green", ColorPreviewImageSrc: "green.png" },
    };
    const templateFunc = renderListWithTemplate.mock.calls[0][0];
    const html = templateFunc(edgeCaseItem);
    expect(html).toContain('<p class="cart-card__quantity">qty: 0</p>'); // Check for zero quantity handling });
  });
});
 