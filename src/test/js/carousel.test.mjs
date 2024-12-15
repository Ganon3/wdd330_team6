//javascript
import { setupCarousel } from "../../js/carousel";
// import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from "jsdom";
import { renderListWithTemplate } from "../../js/utils.mjs";
import { extraDetailSlide } from "../../js/productDetail.mjs";

const htmlTemplate = `
<div id="extraImages">
  <div class="slide"></div>
  <div class="slide"></div>
  <div class="slide"></div>
</div>
`;

let document;

beforeEach(async () => {
  const jsdom = new JSDOM(htmlTemplate, { url: "http://localhost" });
  global.document = jsdom.window.document;
  const baseDiv = global.document.createElement("div");
  baseDiv.id = "extraImages";
  const mockItems = [
    { Src: "slide1.jpg", Title: "Slide 1" },
    { Src: "slide2.jpg", Title: "Slide 2" },
    { Src: "slide3.jpg", Title: "Slide 3" },
  ];
  renderListWithTemplate(extraDetailSlide, baseDiv, mockItems);
  global.window = jsdom.window;
  document = global.document;
  window = global.window;
});

describe("setupCarousel", () => {
  it("initializes with the first slide active", () => {
    setupCarousel();
    expect(
      document.querySelectorAll(".slide")[0].classList.contains("active")
    ).toBe(true);
    expect(
      document.querySelectorAll(".slide")[0].classList.contains("hidden")
    ).toBe(false);
  });

  it("adds navigation buttons to the carousel", () => {
    setupCarousel();
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe("←");
    expect(buttons[1].textContent).toBe("→");
  });

  it("moves to the next slide on next button click", async () => {
    setupCarousel();
    const nextButton = document.querySelector(".next");

    nextButton.click();
    await new Promise((r) => setTimeout(r, 0)); // wait for click event

    const slides = document.querySelectorAll(".slide");
    expect(slides[1].classList.contains("active")).toBe(true);
    expect(slides[1].classList.contains("hidden")).toBe(false);
    expect(slides[0].classList.contains("active")).toBe(false);
    expect(slides[0].classList.contains("hidden")).toBe(true);
  });

  it("cycles back to the first slide after the last slide", async () => {
    setupCarousel();
    const nextButton = document.querySelector(".next");

    // Cycle through all slides
    const totalSlides = document.querySelectorAll(".slide").length;
    for (let i = 0; i < totalSlides; i++) {
      nextButton.click();
    }

    await new Promise((r) => setTimeout(r, 0));
    const slides = document.querySelectorAll(".slide");
    expect(slides[0].classList.contains("active")).toBe(true);
    expect(slides[0].classList.contains("hidden")).toBe(false);
  });

  it("moves to the previous slide on prev button click", async () => {
    setupCarousel();
    const prevButton = document.querySelector(".prev");

    prevButton.click();
    await new Promise((r) => setTimeout(r, 0));

    const slides = document.querySelectorAll(".slide");
    const lastSlideIndex = slides.length - 1;
    expect(slides[lastSlideIndex].classList.contains("active")).toBe(true);
    expect(slides[lastSlideIndex].classList.contains("hidden")).toBe(false);
  });

  it("cycles back to the last slide after the first slide", async () => {
    setupCarousel();
    const totalSlides = document.querySelectorAll(".slide").length;
    const prevButton = document.querySelector(".prev");

    // Go to the first slide
    prevButton.click();
    await new Promise((r) => setTimeout(r, 0));

    // One more click to loop back
    for (let i = 0; i < totalSlides; i++) {
      prevButton.click();
    }

    await new Promise((r) => setTimeout(r, 0));
    const slides = document.querySelectorAll(".slide");
    const lastSlideIndex = slides.length - 1;
    expect(slides[lastSlideIndex].classList.contains("active")).toBe(true);
    expect(slides[lastSlideIndex].classList.contains("hidden")).toBe(false);
  });

  it("should automatically advance the slide every 5 seconds", async () => {
    setupCarousel();
    const slides = document.querySelectorAll(".slide");
    expect(slides[0].classList.contains("active")).toBe(true);

    await new Promise((r) => setTimeout(r, 5000));

    expect(slides[1].classList.contains("active")).toBe(true);
    expect(slides[1].classList.contains("hidden")).toBe(false);
  });
});
//
