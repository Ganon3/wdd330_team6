// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "../../js/utils.mjs";
import { checkout } from "../../js/externalServices.mjs";
import checkoutProcess from "../../js/checkoutProcess.mjs";

vi.mock("../../js/utils.mjs", () => ({
  setLocalStorage: vi.fn(),
  getLocalStorage: vi.fn(),
  alertMessage: vi.fn(),
  removeAllAlerts: vi.fn(),
}));

vi.mock("../../js/externalServices.mjs", () => ({
  checkout: vi.fn(),
}));

global.FormData = vi.fn(() => {
  const data = new Map();

  return {
    append: vi.fn((key, value) => data.set(key, value)),
    get: vi.fn((key) => data.get(key)),
    getAll: vi.fn((key) => [data.get(key)]),
    has: vi.fn((key) => data.has(key)),
    delete: vi.fn((key) => data.delete(key)),
    set: vi.fn((key, value) => data.set(key, value)),
    forEach: vi.fn((callback) => {
      data.forEach((value, key) => callback(value, key, data));
    }),
  };
});
 
describe("checkoutProcess", () => {
  let form, outputSelector, documentSpy;

  beforeEach(() => {
    outputSelector = "#output";
    documentSpy = {
      querySelector: vi.fn().mockImplementation((selector) => {
        if (selector.includes("cartTotal")) {
          return { innerText: "" };
        }
        if (selector.includes("num-items")) {
          return { innerText: "" };
        }
        if (selector.includes("shipping")) {
          return { innerText: "" };
        }
        if (selector.includes("tax")) {
          return { innerText: "" };
        }
        if (selector.includes("orderTotal")) {
          return { innerText: "" };
        }
      }),
    };
    global.document = documentSpy;

    form = {
      elements: [],
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize checkout process with key and outputSelector", () => {
    const key = "cart";

    vi.mocked(getLocalStorage).mockReturnValue([{ FinalPrice: 100 }]);

    checkoutProcess.init(key, outputSelector);

    expect(checkoutProcess.key).toBe(key);
    expect(checkoutProcess.outputSelector).toBe(outputSelector);
    expect(getLocalStorage).toHaveBeenCalledWith(key);
    expect(documentSpy.querySelector).toHaveBeenCalledWith(
      outputSelector + " #cartTotal"
    );
    expect(documentSpy.querySelector).toHaveBeenCalledWith(
      outputSelector + " #num-items"
    );
  });

  it("should calculate item summary correctly", () => {
    checkoutProcess.list = [{ FinalPrice: 100 }, { FinalPrice: 150 }];
    checkoutProcess.outputSelector = outputSelector;

    checkoutProcess.calculateItemSummary();

    expect(checkoutProcess.itemTotal).toBe(250);
    expect(documentSpy.querySelector).toHaveBeenCalledWith(
      outputSelector + " #cartTotal"
    );
    expect(documentSpy.querySelector).toHaveBeenCalledWith(
      outputSelector + " #num-items"
    );
  });

  it("should calculate order total correctly", () => {
    checkoutProcess.list = [{ FinalPrice: 100 }, { FinalPrice: 150 }];
    checkoutProcess.itemTotal = 250;

    checkoutProcess.calculateOrdertotal();

    expect(checkoutProcess.shipping).toBe(12);
    expect(checkoutProcess.tax).toBe("15.00");
    expect(checkoutProcess.orderTotal).toBe("277.00");
  });

});