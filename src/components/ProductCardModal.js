// modal.js (или тот файл, где у тебя модалки)
// предполагается: импортированы app, getCard, showToast где нужно
import { app } from "../main.js";
import { getCard } from "../js/utils";
import { showToast } from "./toast.js";

/**
 * Открывает модалку: удаляет существующие элементы и создаёт новые.
 * Возвращает объект с методами для управления (опционально).
 */
export function openModalWindow(cardId) {
  // Удаляем старые, если есть
  const oldContent = document.querySelector(".m-content");
  if (oldContent) oldContent.remove();
  const oldOverlay = document.querySelector(".m-overlay");
  if (oldOverlay) oldOverlay.remove();

  // Создаём и показываем новую модалку
  const { modalContent, modOverlay, cleanup } = modalWindow(cardId);

  // добавляем обработчик кликов на документ для закрытия по клику вне (альтернативно уже используется overlay)
  function onDocumentMouseDown(e) {
    if (!modalContent.contains(e.target) && !modOverlay.contains(e.target)) {
      // закрываем модалку
      cleanup();
      document.removeEventListener("mousedown", onDocumentMouseDown);
    }
  }

  document.addEventListener("mousedown", onDocumentMouseDown);

  return { modalContent, modOverlay, cleanup };
}

/**
 * Создаёт DOM модалки и все обработчики.
 * Возвращает { modalContent, modOverlay, cleanup }.
 */
export function modalWindow(cardId) {
  const productCardEntity = getCard(cardId);
  if (!productCardEntity) {
    console.warn("modalWindow: product not found for id", cardId);
    return {};
  }

  // === Создаём элементы ===
  const modalContent = document.createElement("div");
  modalContent.className = "m-content";

  const modOverlay = document.createElement("div");
  modOverlay.className = "m-overlay";

  const closeBtn = document.createElement("span");
  closeBtn.className = "m-content__close-btn";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Закрыть");

  const productCard = document.createElement("div");
  productCard.className = "m-content__card";

  // картинка
  const productImg = document.createElement("img");
  productImg.className = "m-content__card__img";
  productImg.src = productCardEntity.image;
  productImg.alt = productCardEntity.name || "Товар";

  // контент
  const productContent = document.createElement("div");
  productContent.className = "m-content__card__content";

  // заголовок
  const productHeader = document.createElement("div");
  productHeader.className = "m-content__card__content__header";
  const productTitle = document.createElement("h2");
  productTitle.className = "m-content__card__content__header__title";
  // формируем title: бренд / имя
  const brandSpan = document.createElement("span");
  brandSpan.textContent = productCardEntity.brand || "";
  const separatorSpan = document.createElement("span");
  separatorSpan.textContent = " / ";
  const titleSpan = document.createElement("span");
  titleSpan.textContent = productCardEntity.name || "";
  productTitle.appendChild(brandSpan);
  productTitle.appendChild(separatorSpan);
  productTitle.appendChild(titleSpan);

  // инфо (цены)
  const productInfo = document.createElement("div");
  productInfo.className = "m-content__card__content__info";

  const productPrice = document.createElement("p");
  productPrice.className = "m-content__card__content__info__final-price";
  productPrice.textContent = (productCardEntity.finalPrice ?? "") + " р. ";
  const priceSpan = document.createElement("span");
  priceSpan.className = "m-content__card__content__info__price";
  priceSpan.textContent = (productCardEntity.price ?? "") + " р.";
  productPrice.appendChild(priceSpan);

  // кнопки
  const buttons = document.createElement("div");
  buttons.className = "m-content__card__content__info__btns";

  const basketBtn = document.createElement("button");
  basketBtn.className = "m-content__card__content__info__btns__basket";
  basketBtn.textContent = "Добавить в корзину";
  basketBtn.setAttribute("data-id", productCardEntity.id);
  const buyBtn = document.createElement("button");
  buyBtn.className = "m-content__card__content__info__btns__buy";
  buyBtn.textContent = "Купить сейчас";
  buyBtn.setAttribute("data-id", productCardEntity.id);

  const infoBtn = document.createElement("a");
  infoBtn.className = "m-content__card__content__info-button";
  infoBtn.textContent = "Больше информации о товаре";
  infoBtn.href = "#"; // при желании ставь реальную ссылку

  // собираем
  buttons.appendChild(basketBtn);
  buttons.appendChild(buyBtn);
  productHeader.appendChild(productTitle);
  productInfo.appendChild(productPrice);
  productInfo.appendChild(buttons);
  productContent.appendChild(productHeader);
  productContent.appendChild(productInfo);
  productContent.appendChild(infoBtn);
  productCard.appendChild(productImg);
  productCard.appendChild(productContent);
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(productCard);

  // вставляем в DOM
  app.appendChild(modOverlay);
  app.appendChild(modalContent);

  // показываем (добавляем active классы чтобы CSS плавно показал)
  requestAnimationFrame(() => {
    modalContent.classList.add("active");
    modOverlay.classList.add("active");
  });

  // === Синхронизация состояния: определяем, в корзине ли товар сейчас ===
  // Мы ориентируемся на кнопку на странице: .card__button[data-id="..."]
  const pageButton = document.querySelector(`.card__button[data-id="${productCardEntity.id}"]`);
  let inCart = !!(pageButton && pageButton.classList.contains("card__button-two"));

  // Утилита для обновления UI модалки по состоянию inCart
  function updateModalButtonUI() {
    if (inCart) {
      basketBtn.textContent = "Перейти в корзину!";
      basketBtn.classList.add("card__button-two");
      buyBtn.style.display = "none";
    } else {
      basketBtn.textContent = "Добавить в корзину";
      basketBtn.classList.remove("card__button-two");
      buyBtn.style.display = "";
    }
  }

  // Синхронизируем начальное состояние
  updateModalButtonUI();

  // === Обработчик клика по basketBtn в модалке ===
  function onBasketBtnClick(e) {
    e.stopPropagation();

    // Если еще не в корзине — помечаем и диспатчим событие
    if (!inCart) {
      inCart = true;
      updateModalButtonUI();

      // Диспатчим событие для всего приложения — карточки на странице и другие слушатели обновятся
      const event = new CustomEvent("cart:change", {
        detail: { id: productCardEntity.id, inCart: true },
      });
      document.dispatchEvent(event);

      // Показываем тост
      try { showToast(); } catch (err) { /* если showToast не определён */ }
      return;
    }

    // Если уже в корзине — сделаем редирект в корзину (при желании)
    // window.location.href = "/cart"; // раскомментировать если есть маршрут
  }

  basketBtn.addEventListener("click", onBasketBtnClick);

  // === Подписка на глобальные изменения корзины, чтобы модалка реагировала ===
  function onCartChange(e) {
    const { id, inCart: newState } = e.detail || {};
    if (String(id) !== String(productCardEntity.id)) {
      // игнорируем другие товары
      return;
    }
    // обновляем состояние и UI
    inCart = !!newState;
    updateModalButtonUI();
  }

  document.addEventListener("cart:change", onCartChange);

  // === Также: слушаем изменения на странице (опционально) — если кнопка страницы изменила класс напрямую ===
  // Если карточка на странице вручную меняет класс, можно отслеживать MutationObserver (опционально).
  // Для простоты пока не ставим observer — мы полагаемся на событие cart:change.

  // === Закрытие модалки и очистка ===
  function cleanup() {
    // удаляем слушатели
    basketBtn.removeEventListener("click", onBasketBtnClick);
    document.removeEventListener("cart:change", onCartChange);

    // удаляем элементы
    modalContent.classList.remove("active");
    modOverlay.classList.remove("active");

    // небольшая задержка чтобы анимация ушла (если нужно)
    setTimeout(() => {
      modalContent.remove();
      modOverlay.remove();
    }, 120);
  }
  // закрытие по крестику
  closeBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    cleanup();
  });

  // закрытие по оверлею (клик по затемнению)
  modOverlay.addEventListener("click", (ev) => {
    ev.stopPropagation();
    cleanup();
  });

  // Возвращаем полезные объекты и функцию очистки
  return { modalContent, modOverlay, cleanup };
}