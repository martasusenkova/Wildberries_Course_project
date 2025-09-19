import "../styles/slider.scss";
export let sliderWrapper;

export function createSlider() {
  const sliderWrapper = document.createElement("div");
  sliderWrapper.classList.add("slider");

  const sliderTrack = document.createElement("div");
  sliderTrack.classList.add("slider__track");
  sliderWrapper.appendChild(sliderTrack);

  const imagesBig = [
    "/Wildberries_Course_project/slider_images/slider7_big.webp",
    "/slider_images/slider1_big.webp",
    "/slider_images/slider2_big.webp",
    "/slider_images/slider3_big.webp",
    "/slider_images/slider4_big.webp",
    "/slider_images/slider5_big.webp",
    "/slider_images/slider6_big.webp",
  ];
  const imagesMedium = [
    "/slider_images/slider7_medium.webp",
    "/slider_images/slider1_medium.webp",
    "/slider_images/slider2_medium.webp",
    "/slider_images/slider3_medium.webp",
    "/slider_images/slider4_medium.webp",
    "/slider_images/slider5_medium.webp",
    "/slider_images/slider6_medium.webp",
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

  // Ждём полной загрузки страницы (включая стили и изображения)
  window.addEventListener("load", () => {
    // Ждём, пока всё отрисуется, затем устанавливаем позицию слайдера без анимации
    requestAnimationFrame(() => {
      slideWidth = sliderWrapper.offsetWidth; // Получаем ширину одного слайда
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = `translateX(-${
        slideWidth * currentIndex
      }px)`; // Сдвигаем слайдер на нужную позицию
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

  // вызываем и передаем анонимные функции в качестве аргументов
  enableSliderDragging(
    sliderTrack, // 1. Элемент, который будем двигать мышкой (трек слайдов)
    () => slideWidth, // 2. Функция, возвращающая ширину слайда
    () => currentIndex, // 3. Функция, возвращающая текущий слайд (чтобы знать, где мы находимся)
    () => images.length, // 4. Функция, возвращающая общее количество слайдов
    goToSlide // 5. Функция, которая будет вызываться для перехода к нужному слайду
  );

  return sliderWrapper;
}

// даем имена выше написанным функциям
export function enableSliderDragging(
  sliderTrack,
  getSlideWidth,
  getCurrentIndex,
  getImagesLength,
  goToSlide
) {
  let isDragging = false; // проверка, тащит ли сейчас пользователь слайдер
  let startX = 0; // начальная позиция по X (где началось перетаскивание)
  let moveX = 0; // текущее смещение по X во время перетаскивания
  let animationID; // ID анимации для отмены через cancelAnimationFrame
  let currentTranslate = 0; // текущее смещение слайдера (в пикселях)
  let hasMoved = false; // проверка, был ли реально сдвиг (чтобы не реагировать на клик)
  const minMove = 5; // минимальное смещение, при котором слайдер двигается

  // Получает позицию X мыши или пальца
  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

  const animation = () => {
    if (isDragging) {
      sliderTrack.style.transform = `translateX(${currentTranslate}px)`; // Смещаем слайдер в реальном времени на значение currentTranslate
      requestAnimationFrame(animation); // Запрашиваем следующий кадр — цикл продолжается, пока тащим
    }
  };

  const touchStart = (e) => {
    isDragging = true; // включаем режим перетаскивания
    hasMoved = false; // пока что слайдер не сдвигался
    startX = getPositionX(e); // запоминаем начальную позицию нажатия
    sliderTrack.style.transition = "none"; // отключаем плавность
  };

  const touchMove = (e) => {
    if (!isDragging) return; // если не двигали - ничего не делаем
    const currentPosition = getPositionX(e); // получаем текущую позицию
    moveX = currentPosition - startX; // вычисляем, насколько сдвинули

    // если сдвиг больше порога (5px)
    if (Math.abs(moveX) > minMove) {
      if (!hasMoved) {
        hasMoved = true; // первый реальный сдвиг
        animationID = requestAnimationFrame(animation); // запускаем анимацию движения
      }

      // Вычисляем смещение: начальная позиция минус смещение
      currentTranslate = -getSlideWidth() * getCurrentIndex() + moveX;
    }
  };

  const touchEnd = () => {
    cancelAnimationFrame(animationID);
    isDragging = false;

    let currentIndex = getCurrentIndex();
    const slideWidth = getSlideWidth(); //возвращает ширину одного слайда
    const threshold = slideWidth * 0.1; // пороговое значение для сдвига слайда

    //  Если не тянули вообще — ничего не делай
    if (!hasMoved) {
      goToSlide(currentIndex);
      moveX = 0;
      return;
    }

    // Если сдвинули немного (меньше 5 пикселей), то просто верни слайд на место — это не движение, а клик
    if (Math.abs(moveX) < 5) {
      goToSlide(getCurrentIndex());
      return;
    }
    // Если сдвиг больше порогового значения (то есть пользователь потянул достаточно сильно)
    if (Math.abs(moveX) > threshold) {
      // Если потянули влево (moveX < 0) и не достигли последнего слайда
      if (moveX < 0 && currentIndex < getImagesLength() + 1) {
        currentIndex++; // Переходим к следующему слайду
      }
      // Если потянули вправо (moveX > 0) и не на первом слайде
      else if (moveX > 0 && currentIndex > 0) {
        currentIndex--; // Переходим к предыдущему слайду
      }
    }

    goToSlide(currentIndex); // Переходим к слайду с обновлённым индексом

    moveX = 0; // Сбрасываем смещение, чтобы подготовиться к следующему перетаскиванию

    hasMoved = false; // Сбрасываем проверку движения
  };

  sliderTrack.addEventListener("mousedown", touchStart); // Начинаем перетаскивание при нажатии мыши

  sliderTrack.addEventListener("mousemove", touchMove); // Обновляем позицию слайдера при движении мыши

  // Заканчиваем перетаскивание при отпускании мыши
  sliderTrack.addEventListener("mouseup", () => {
    if (isDragging) touchEnd();
  });

  sliderTrack.addEventListener("mouseleave", () => isDragging && touchEnd()); // Если мышь покидает область слайдера — тоже заканчиваем перетаскивание

  // Обработчики касаний для мобильных устройств (тач-события)

  sliderTrack.addEventListener("touchstart", touchStart, { passive: true }); // Начинаем перетаскивание пальцем

  sliderTrack.addEventListener("touchmove", touchMove, { passive: true }); // Обновляем позицию слайдера при движении пальца

  sliderTrack.addEventListener("touchend", touchEnd); // Заканчиваем перетаскивание пальцем
}
