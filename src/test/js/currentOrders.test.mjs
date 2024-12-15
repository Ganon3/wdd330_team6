// import { describe, it, expect, vi } from 'vitest';
import currentOrders from "../../js/currentOrders.mjs";
import { getOrders } from "../../js/externalServices.mjs";

vi.mock("../../js/externalServices.mjs", () => ({
  getOrders: vi.fn(),
}));

describe("currentOrders", () => {
  const mockOrders = [
    {
      id: 1,
      orderDate: "2022-11-12T00:00:00.000Z",
      items: ["item1", "item2"],
      orderTotal: 100.0,
    },
    {
      id: 2,
      orderDate: "2022-12-13T00:00:00.000Z",
      items: ["item3"],
      orderTotal: 50.0,
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = "<table><tbody></tbody></table>";
    vi.clearAllMocks();
  });

  it("should render orders correctly when getOrders resolves", async () => {
    getOrders.mockResolvedValue(mockOrders);
    await currentOrders("table", "valid-token");

    const rows = document.querySelectorAll("table tbody tr");
    expect(rows.length).toBe(2);
    expect(rows[0].innerHTML).toContain("<td>1</td>");
    expect(rows[0].innerHTML).toContain("11/11/2022");
    expect(rows[0].innerHTML).toContain("<td>2</td>");
    expect(rows[0].innerHTML).toContain("<td>100</td>");
    expect(rows[1].innerHTML).toContain("<td>2</td>");
    expect(rows[1].innerHTML).toContain("12/12/2022");
    expect(rows[1].innerHTML).toContain("<td>1</td>");
    expect(rows[1].innerHTML).toContain("<td>50</td>");
  });

  it("should handle cases where getOrders returns an empty array", async () => {
    getOrders.mockResolvedValue([]);
    await currentOrders("table", "valid-token");

    const rows = document.querySelectorAll("table tbody tr");
    expect(rows.length).toBe(0);
  });

  it("should log an error when getOrders rejects", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    getOrders.mockRejectedValue(new Error("Network Error"));

    await currentOrders("table", "valid-token");

    expect(consoleSpy).toHaveBeenCalledWith(new Error("Network Error"));
  });

  it("should not fail if the selector is invalid", async () => {
    getOrders.mockResolvedValue(mockOrders);

    document.body.innerHTML = "";
    await currentOrders("invalid-selector", "valid-token");

    const parent = document.querySelector("invalid-selector tbody");
    expect(parent).toBeNull();
  });

  it("should handle null or undefined token gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    getOrders.mockRejectedValue(new Error("Invalid Token"));

    await currentOrders("table", null);

    expect(consoleSpy).toHaveBeenCalledWith(new Error("Invalid Token"));

    await currentOrders("table", undefined);

    expect(consoleSpy).toHaveBeenCalledWith(new Error("Invalid Token"));
  });
});
