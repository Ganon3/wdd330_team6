// Import necessary modules and mock functions
import {
  qs,
  getLocalStorage,
  setLocalStorage,
  setClick,
  getParam,
  renderListWithTemplate,
  renderWithTemplate,
  loadTemplate,
  loadHeaderFooter,
  alertMessage,
  removeAllAlerts,
} from "../../js/utils.mjs";

describe("qs", () => {
  it("should return the matched element", () => {
    // arrange
    document.body.innerHTML = `<div class="test"></div>`;
    // act
    const element = qs(".test");
    // assert
    expect(element).not.toBeNull();
    expect(element.className).toBe("test");
  });

  it("should return null if no element matched", () => {
    document.body.innerHTML = ``;
    const element = qs(".test");
    expect(element).toBeNull();
  });
});

describe("getLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return parsed data from local storage", () => {
    const key = "testKey";
    const data = { a: 1 };
    localStorage.setItem(key, JSON.stringify(data));
    expect(getLocalStorage(key)).toEqual(data);
  });

  it("should return null for non-existent key", () => {
    expect(getLocalStorage("nonExistentKey")).toBeNull();
  });

  it("should return null if JSON parsing fails", () => {
    const key = "invalidJSON";
    localStorage.setItem(key, '{"a: 1}');
    expect(getLocalStorage(key)).toBeNull();
  });
});

describe("setLocalStorage", () => {
  it("should save data to local storage", () => {
    const key = "testKey";
    const data = { b: 2 };
    setLocalStorage(key, data);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(data));
  });
});

describe("setClick", () => {
  it("should set click and touchend listeners", () => {
    const callback = vi.fn();
    document.body.innerHTML = `<button class="testButton"></button>`;
    setClick(".testButton", callback);
    const button = qs(".testButton");

    const touchendEvent = new Event("touchend");
    button.dispatchEvent(touchendEvent);
    expect(callback).toHaveBeenCalled();

    button.click();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe("getParam", () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: "?param1=value1&param2=value2" };
  });

  it("should return the correct value for existing parameter", () => {
    expect(getParam("param1")).toBe("value1");
    expect(getParam("param2")).toBe("value2");
  });

  it("should return null for non-existent parameter", () => {
    expect(getParam("param3")).toBeNull();
  });
});

describe("renderListWithTemplate", () => {
  it("should render list using template function", () => {
    const templateFn = vi.fn((item) => `<div>${item}</div>`);
    const parentElement = document.createElement("div");
    const list = ["item1", "item2"];
    renderListWithTemplate(templateFn, parentElement, list);

    expect(parentElement.innerHTML).toBe("<div>item1</div><div>item2</div>");
    list.map((item,index,mapList) => expect(templateFn).toHaveBeenCalledWith(item, index, mapList));
  });

  it("should clear parent element if clear is true", () => {
    const templateFn = () => "<div></div>";
    const parentElement = document.createElement("div");
    parentElement.innerHTML = "Old Content";

    renderListWithTemplate(templateFn, parentElement, [], "afterbegin", true);
    expect(parentElement.innerHTML).toBe("");
  });

  it("should not clear parent element if clear is false", () => {
    const templateFn = () => "<div></div>";
    const parentElement = document.createElement("div");
    parentElement.innerHTML = "Old Content";

    renderListWithTemplate(templateFn, parentElement, [], "afterbegin", false);
    expect(parentElement.innerHTML).toBe("Old Content");
  });
});

describe("renderWithTemplate", () => {
  it("should render data using async template function", async () => {
    const templateFn = vi.fn(() => Promise.resolve("<div>data</div>"));
    const parentElement = document.createElement("div");
    const data = "data";

    await renderWithTemplate(templateFn, parentElement, data);

    expect(parentElement.innerHTML).toBe("<div>data</div>");
    expect(templateFn).toHaveBeenCalledWith(data);
  });

  it("should clear parent element if clear is true", async () => {
    const templateFn = () => Promise.resolve("<div></div>");
    const parentElement = document.createElement("div");
    parentElement.innerHTML = "Old Data";

    await renderWithTemplate(
      templateFn,
      parentElement,
      {},
      undefined,
      "afterbegin",
      true
    );
    expect(parentElement.innerHTML).toBe("<div></div>");
  });

  it("should invoke callback after rendering", async () => {
    const templateFn = () => Promise.resolve("<div>data</div>");
    const callback = vi.fn();
    const parentElement = document.createElement("div");

    await renderWithTemplate(templateFn, parentElement, {}, callback);
    expect(callback).toHaveBeenCalled();
  });
});

describe("loadTemplate", () => {
  it("should return the HTML content from a fetch request", async () => {
    const responseHtml = "<p>Template Content</p>";
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(responseHtml),
      })
    );

    const templateFn = loadTemplate("/path/to/template.html");
    const html = await templateFn();
    expect(html).toBe(responseHtml);
  });

  it("should return undefined if the fetch response is not ok", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const templateFn = loadTemplate("/invalid/template.html");
    const html = await templateFn();
    expect(html).toBeUndefined();
  });
});

describe("loadHeaderFooter", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="main-header"></div>
      <div id="main-footer"></div>
    `;
  });

  it("should load templates into header and footer", async () => {
    const templateHtml = "<div>Header/Footer Content</div>";
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(templateHtml),
      })
    );

    await loadHeaderFooter();
    expect(document.getElementById("main-header").innerHTML).toBe(templateHtml);
    expect(document.getElementById("main-footer").innerHTML).toBe(templateHtml);
  });
});

describe("alertMessage", () => {
  beforeEach(() => {
    document.body.innerHTML = `<main></main>`;
  });

  it("should create and prepend alert message", () => {
    alertMessage("Test Alert");
    const alert = document.querySelector(".alert");
    expect(alert).not.toBeNull();
    expect(alert.innerHTML).toContain("Test Alert");
  });

  it("should scroll to top if scroll is true", () => {
    global.scrollTo = vi.fn();
    alertMessage("Test Alert", true);
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should not scroll to top if scroll is false", () => {
    global.scrollTo = vi.fn();
    alertMessage("Test Alert", false);
    expect(global.scrollTo).not.toHaveBeenCalled();
  });
});

describe("removeAllAlerts", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div class="alert">Alert 1</div>
        <div class="alert">Alert 2</div>
      </main>
    `;
  });

  it("should remove all alert elements", () => {
    removeAllAlerts();
    const alerts = document.querySelectorAll(".alert");
    expect(alerts.length).toBe(0);
  });
});
