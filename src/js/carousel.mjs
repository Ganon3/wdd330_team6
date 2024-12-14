
export function setupCarousel() {
  const carousel = document.querySelector("#extraImages");
  const slides = carousel.querySelectorAll(".slide");
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add("active");
        slide.classList.remove("hidden");
      } else {
        slide.classList.remove("active");
        slide.classList.add("hidden");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  // Auto-advance the carousel every 5 seconds
  setInterval(nextSlide, 5000);

  // Add navigation buttons
  const prevButton = document.createElement("button");
  prevButton.textContent = "←";
  prevButton.classList.add("carousel-nav", "prev");
  prevButton.addEventListener("click", prevSlide);

  const nextButton = document.createElement("button");
  nextButton.textContent = "→";
  nextButton.classList.add("carousel-nav", "next");
  nextButton.addEventListener("click", nextSlide);

  carousel.appendChild(prevButton);
  carousel.appendChild(nextButton);

  // Initialize the first slide
  showSlide(currentSlide);
}
