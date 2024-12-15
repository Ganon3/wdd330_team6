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

describe("checkoutProcess-success", () => {
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
  it("should handle checkout success", async () => {
    vi.mocked(checkout).mockResolvedValue({});
    const json = {
      orderDate: expect.any(Date),
      orderTotal: checkoutProcess.orderTotal,
      tax: checkoutProcess.tax,
      shipping: checkoutProcess.shipping,
      items: expect.any(Array),
    };

    await checkoutProcess.checkout(form);

    expect(checkout).toHaveBeenCalledWith(expect.objectContaining(json));
    expect(setLocalStorage).toHaveBeenCalledWith("so-cart", []);
  });

  it("should handle checkout failure", async () => {
    vi.mocked(checkout).mockRejectedValue({ message: ["Error Message"] });

    await checkoutProcess.checkout(form);

    expect(removeAllAlerts).toHaveBeenCalled();
    expect(alertMessage).toHaveBeenCalledWith("Error Message");
  });
});
 