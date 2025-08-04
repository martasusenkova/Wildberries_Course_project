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
    "src/assets/slider_images/slider1_medium.webp",
    "src/assets/slider_images/slider2_medium.webp",
    "src/assets/slider_images/slider3_medium.webp",
    "src/assets/slider_images/slider4_medium.webp",
    "src/assets/slider_images/slider5_medium.webp",
    "src/assets/slider_images/slider6_medium.webp",
  ];

  let images = getResponsiveImages();
  let slideWidth;
  let currentIndex = 1;
  let prevTranslate = 0;

  function getResponsiveImages() {
    return window.innerWidth <= 768 ? imagesMedium : imagesBig;
  }

  //  Создание слайда
  const createSlide = (src) => {
    const slide = document.createElement("div");
    slide.classList.add("slider__item");

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Slide";
    img.draggable = false; // запретить перетаскивание картинки

    slide.appendChild(img);
    return slide;
  };

  //  Добавляем клоны (для бесконечной прокрутки)
  sliderTrack.appendChild(createSlide(images[images.length - 1])); // last clone
  images.forEach((src) => sliderTrack.appendChild(createSlide(src))); // оригинальные
  sliderTrack.appendChild(createSlide(images[0])); // first clone

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      slideWidth = sliderWrapper.offsetWidth;
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`;
    });
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

    prevTranslate = -slideWidth * currentIndex;
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
      requestAnimationFrame(() => {
        sliderTrack.style.transform = `translateX(-${
          slideWidth * currentIndex
        }px)`;
      });
    } else if (currentIndex === 0) {
      sliderTrack.style.transition = "none";
      currentIndex = images.length;
      requestAnimationFrame(() => {
        sliderTrack.style.transform = `translateX(-${
          slideWidth * currentIndex
        }px)`;
      });
    }
    updatePagination();
    console.log(slideWidth);
  });

  // При ресайзе — пересчитать ширину и перерендерить изображения
  window.addEventListener("resize", () => {
    const newImages = getResponsiveImages();
    if (newImages.toString() !== images.toString()) {
      images = newImages;
      currentIndex = 1;
      sliderTrack.innerHTML = "";
      sliderTrack.appendChild(createSlide(images[images.length - 1]));
      images.forEach((src) => sliderTrack.appendChild(createSlide(src)));
      sliderTrack.appendChild(createSlide(images[0]));
    }

    slideWidth = sliderWrapper.offsetWidth;
    prevTranslate = -slideWidth * currentIndex;
    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  });

  enableSliderDragging(
    sliderTrack,
    () => slideWidth,
    () => currentIndex,
    () => images.length,
    goToSlide
  );

  return sliderWrapper;
}

export function enableSliderDragging(
  sliderTrack,
  getSlideWidth,
  getCurrentIndex,
  getImagesLength,
  goToSlide
) {
  let isDragging = false;
  let startX = 0;
  let moveX = 0;
  let animationID;
  let currentTranslate = 0;
  let hasMoved = false;
  const minMove = 5;
  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

  const animation = () => {
    if (isDragging) {
      sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  };

  const touchStart = (e) => {
    isDragging = true;
    hasMoved = false;
    startX = getPositionX(e);
    sliderTrack.style.transition = "none";
  };

  const touchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    moveX = currentPosition - startX;

    if (Math.abs(moveX) > minMove) {
      if (!hasMoved) {
        hasMoved = true;
        animationID = requestAnimationFrame(animation);
      }
      currentTranslate = -getSlideWidth() * getCurrentIndex() + moveX;
    }
  };

  const touchEnd = () => {
    cancelAnimationFrame(animationID);
    isDragging = false;

    let currentIndex = getCurrentIndex();
    const slideWidth = getSlideWidth();
    const threshold = slideWidth * 0.1;

    //  Если не тянули вообще — ничего не делай
    if (!hasMoved) {
      goToSlide(currentIndex);
      moveX = 0;
      return;
    }

    // Если тянули чуть-чуть — верни обратно
    if (Math.abs(moveX) < 5) {
      goToSlide(getCurrentIndex()); // когда мы просто кликаем, а не тянем
      return;
    }
    // Если достаточно тянули - перелестни
    if (Math.abs(moveX) > threshold) {
      if (moveX < 0 && currentIndex < getImagesLength()) {
        currentIndex++;
      } else if (moveX > 0 && currentIndex > 0) {
        currentIndex--;
      }
    }

    goToSlide(currentIndex);
    moveX = 0;
    hasMoved = false;
  };

  sliderTrack.addEventListener("mousedown", touchStart);
  sliderTrack.addEventListener("mousemove", touchMove);
  sliderTrack.addEventListener("mouseup", () => {
    if (isDragging) touchEnd();
  });
  sliderTrack.addEventListener("mouseleave", () => isDragging && touchEnd());

  sliderTrack.addEventListener("touchstart", touchStart, { passive: true });
  sliderTrack.addEventListener("touchmove", touchMove, { passive: true });
  sliderTrack.addEventListener("touchend", touchEnd);
}
