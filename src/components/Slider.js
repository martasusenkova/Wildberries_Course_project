import "../styles/slider.scss";

export function createSlider() {
  const sliderWrapper = document.createElement("div");
  sliderWrapper.classList.add("slider");

  const sliderTrack = document.createElement("div");
  sliderTrack.classList.add("slider__track");
  sliderWrapper.appendChild(sliderTrack);

  const imagesBig = [
    "src/assets/slider_images/slider1_big.webp",
    "src/assets/slider_images/slider2_big.webp",
    "src/assets/slider_images/slider3_big.webp",
    "src/assets/slider_images/slider4_big.webp",
    "src/assets/slider_images/slider5_big.webp",
    "src/assets/slider_images/slider6_big.webp",
  ];
  const imagesMedium = [
    "src/assets/slider_images/slider2_medium.webp",
    "src/assets/slider_images/slider3_medium.webp",
    "src/assets/slider_images/slider4_medium.webp",
    "src/assets/slider_images/slider5_medium.webp",
    "src/assets/slider_images/slider6_medium.webp",
  ];

  let images = getResponsiveImages();
  let slideWidth;
  let currentIndex = 1;

  function getResponsiveImages() {
    return window.innerWidth <= 768 ? imagesMedium : imagesBig;
  }

  //  Создание слайда
  const createSlide = (src) => {
    const slide = document.createElement("div");
    slide.classList.add("slider__item");
    slide.innerHTML = `<img src="${src}" alt="Slide" />`;
    return slide;
  };

  //  Добавляем клоны (для бесконечной прокрутки)
  sliderTrack.appendChild(createSlide(images[images.length - 1])); // last clone
  images.forEach((src) => sliderTrack.appendChild(createSlide(src))); // оригинальные
  sliderTrack.appendChild(createSlide(images[0])); // first clone

  window.addEventListener("load", () => {
    slideWidth = sliderWrapper.offsetWidth;
    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  });

  // Кнопки
  const btnPrev = document.createElement("button");
  btnPrev.classList.add("slider__btn", "slider__btn--prev");
  btnPrev.innerHTML = "&#10094;";

  const btnNext = document.createElement("button");
  btnNext.classList.add("slider__btn", "slider__btn--next");
  btnNext.innerHTML = "&#10095;";

  sliderWrapper.appendChild(btnPrev);
  sliderWrapper.appendChild(btnNext);

  // ПАГИНАЦИЯ
  const pagination = document.createElement("div");
  pagination.classList.add("slider__pagination");
  const dots = [];

  images.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("slider__dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i + 1)); // +1 из-за клонированного слайда
    pagination.appendChild(dot);
    dots.push(dot);
  });

  sliderWrapper.appendChild(pagination);

  //  Переход к нужному слайду
  const goToSlide = (index) => {
    sliderTrack.style.transition = "transform 0.2s";
    sliderTrack.style.transform = `translateX(-${slideWidth * index}px)`;
    currentIndex = index;
    updatePagination();
  };

  const updatePagination = () => {
    // currentIndex начинается с 1
    const visibleIndex = currentIndex - 1;
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === visibleIndex % images.length)
    );
  };
  //  Обработчики кнопок
  btnNext.addEventListener("click", () => {
    if (currentIndex < images.length + 1) goToSlide(currentIndex + 1);
  });

  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  });

  //  Зацикливание
  sliderTrack.addEventListener("transitionend", () => {
    if (currentIndex === images.length + 1) {
      sliderTrack.style.transition = "none";
      currentIndex = 1;
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    } else if (currentIndex === 0) {
      sliderTrack.style.transition = "none";
      currentIndex = images.length;
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    }
    updatePagination();
  });
  // При ресайзе — пересчитать ширину и перерендерить изображения
  window.addEventListener("resize", () => {
    const newImages = getResponsiveImages();
    if (newImages.toString() !== images.toString()) {
      // Если изменился массив изображений
      images = newImages;
      currentIndex = 1;
      sliderTrack.innerHTML = "";
      sliderTrack.appendChild(createSlide(images[images.length - 1]));
      images.forEach((src) => sliderTrack.appendChild(createSlide(src)));
      sliderTrack.appendChild(createSlide(images[0]));
      slideWidth = sliderWrapper.offsetWidth;
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    } else {
      slideWidth = sliderWrapper.offsetWidth;
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    }
  });
  return sliderWrapper;
}
