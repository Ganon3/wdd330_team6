// import { describe, it, expect, vi } from 'vitest';
import {
  getProductsByCategory,
  findProductById,
  checkout,
  loginRequest,
  getOrders,
} from "../../js/externalServices.mjs";
 
describe("API Functions", () => {

  const baseURL = import.meta.env.VITE_SERVER_URL
  beforeEach(() => {
    global.fetch = vi.fn();
  });
 
  afterEach(() => {
    vi.clearAllMocks();
  });
 
  describe("getProductsByCategory", () => {
    it("should return products for a valid category", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ Result: ["Product1", "Product2"] }),
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await getProductsByCategory("electronics");
      expect(fetch).toHaveBeenCalledWith(
        baseURL + "products/search/electronics"
      );
      expect(result).toEqual(["Product1", "Product2"]);
    });

    it("should throw an error for a failed request", async () => {
      const mockResponse = {
        ok: false,
        json: async () => "Error Message",
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(getProductsByCategory("invalidCategory")).rejects.toEqual({
        name: "servicesError",
        message: "Error Message",
      });
    });
  });
 
  describe("findProductById", () => {
    it("should return a product for a valid id", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ Result: { id: "123", name: "Product Name" } }),
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await findProductById("123");
      expect(fetch).toHaveBeenCalledWith(baseURL + "product/123");
      expect(result).toEqual({ id: "123", name: "Product Name" });
    });

    it("should throw an error for a failed request", async () => {
      const mockResponse = {
        ok: false,
        json: async () => "Product Not Found",
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(findProductById("invalidId")).rejects.toEqual({
        name: "servicesError",
        message: "Product Not Found",
      });
    });
  });

  describe("checkout", () => {
    it("should complete checkout successfully", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ Result: "Order Placed" }),
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await checkout({ cartItems: ["item1", "item2"] });
      expect(fetch).toHaveBeenCalledWith(baseURL + "checkout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: ["item1", "item2"] }),
      });
      expect(result).toEqual({ Result: "Order Placed" });
    });

    it("should throw an error for a failed checkout", async () => {
      const mockResponse = {
        ok: false,
        json: async () => "Checkout Failed",
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(checkout({ cartItems: [] })).rejects.toEqual({
        name: "servicesError",
        message: "Checkout Failed",
      });
    });
  });

  describe("loginRequest", () => {
    it("should return access token for valid credentials", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ accessToken: "validToken" }),
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await loginRequest({ username: "user", password: "pass" });
      expect(fetch).toHaveBeenCalledWith(baseURL + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "user", password: "pass" }),
      });
      expect(result).toEqual("validToken");
    });

    it("should throw an error for invalid credentials", async () => {
      const mockResponse = {
        ok: false,
        json: async () => "Invalid Credentials",
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(
        loginRequest({ username: "wrong", password: "wrong" })
      ).rejects.toEqual({
        name: "servicesError",
        message: "Invalid Credentials",
      });
    });
  });

  describe("getOrders", () => {
    it("should return orders for a valid token", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ["Order1", "Order2"],
      };
      fetch.mockResolvedValueOnce(mockResponse);

      const result = await getOrders("validToken");
      expect(fetch).toHaveBeenCalledWith(baseURL + "orders", {
        method: "GET",
        headers: { Authorization: "Bearer validToken" },
      });
      expect(result).toEqual(["Order1", "Order2"]);
    });

    it("should throw an error for a request with an invalid token", async () => {
      const mockResponse = {
        ok: false,
        json: async () => "Unauthorized",
      };
      fetch.mockResolvedValueOnce(mockResponse);

      await expect(getOrders("invalidToken")).rejects.toEqual({
        name: "servicesError",
        message: "Unauthorized",
      });
    });
  });
});
