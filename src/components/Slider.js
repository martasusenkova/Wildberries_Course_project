import "../styles/slider.scss";

export function createSlider() {
  const sliderWrapper = document.createElement("div");
  sliderWrapper.classList.add("slider");

  const sliderTrack = document.createElement("div");
  sliderTrack.classList.add("slider__track");

  const w = [
    "src/assets/slider2.webp",
    "src/assets/slider2_2.webp",
    "src/assets/slider2_3.webp",
    "src/assets/slider2_4.webp",
    "src/assets/slider2.webp",
  ];
  const images = [
    "src/assets/slider1_big.webp",
    "src/assets/slider2_big.webp",
    "src/assets/slider3_big.webp",
    "src/assets/slider4_big.webp",
  ];

  // Клонируем последний и первый слайды
  const lastClone = document.createElement("div");
  lastClone.classList.add("slider__item");
  lastClone.innerHTML = `<img src="${images[images.length - 1]}" />`;
  sliderTrack.appendChild(lastClone);

  // Основные слайды
  images.forEach((src) => {
    const item = document.createElement("div");
    item.classList.add("slider__item");
    item.innerHTML = `<img src="${src}" />`;
    sliderTrack.appendChild(item);
  });

  const firstClone = document.createElement("div");
  firstClone.classList.add("slider__item");
  firstClone.innerHTML = `<img src="${images[0]}" />`;
  sliderTrack.appendChild(firstClone);

  // Кнопки
  const btnPrev = document.createElement("button");
  btnPrev.classList.add("slider__btn", "slider__btn--prev");
  btnPrev.innerHTML = "&#10094;";

  const btnNext = document.createElement("button");
  btnNext.classList.add("slider__btn", "slider__btn--next");
  btnNext.innerHTML = "&#10095;";

  sliderWrapper.appendChild(sliderTrack);
  sliderWrapper.appendChild(btnPrev);
  sliderWrapper.appendChild(btnNext);

  // Логика
  const slideWidth = 1400;
  let currentIndex = 1;

  sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  const goToSlide = (index) => {
    sliderTrack.style.transition = "transform 0.4s ease-in-out";
    sliderTrack.style.transform = `translateX(-${slideWidth * index}px)`;
    currentIndex = index;
  };

  btnNext.addEventListener("click", () => {
    if (currentIndex >= images.length + 1) return;
    goToSlide(currentIndex + 1);
  });

  btnPrev.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    goToSlide(currentIndex - 1);
  });

  sliderTrack.addEventListener("transitionend", () => {
    if (currentIndex === images.length + 1) {
      sliderTrack.style.transition = "none";
      currentIndex = 1;
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    }

    if (currentIndex === 0) {
      sliderTrack.style.transition = "none";
      currentIndex = images.length;
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    }
  });

  return sliderWrapper;
}
