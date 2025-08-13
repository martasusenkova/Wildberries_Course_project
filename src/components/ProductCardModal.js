import { app } from "../main.js";
import { getCard } from "../js/utils";
import { showToast } from "./Toast.js";
import { addProdInbasket } from "../js/localStorage.js";
import { openBasket } from "./Basket.js";
import { changeTextInRedCircle } from "./Header.js";

/**
 * Открывает модальное окно с товаром.
 */
export function openModalWindow(cardId) {
  // Удаляем предыдущую модалку, если она есть
  document.querySelector(".m-content")?.remove();
  document.querySelector(".m-overlay")?.remove();

  const { modalContent, modOverlay, cleanup } = modalWindow(cardId);

  function onDocumentMouseDown(e) {
    if (!modalContent.contains(e.target)) {
      cleanup();
      document.removeEventListener("mousedown", onDocumentMouseDown);
    }
  }

  document.addEventListener("mousedown", onDocumentMouseDown);
}

/**
 * Создаёт и возвращает модалку, оверлей и функцию закрытия.
 */
export function modalWindow(cardId) {
  const product = getCard(cardId);
  if (!product) {
    console.warn("Товар не найден:", cardId);
    return {};
  }

  // --- Создание элементов ---
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

  const productImg = document.createElement("img");
  productImg.className = "m-content__card__img";
  productImg.src = product.image;
  productImg.alt = product.name;

  const productContent = document.createElement("div");
  productContent.className = "m-content__card__content";

  const productHeader = document.createElement("div");
  productHeader.className = "m-content__card__content__header";

  const productTitle = document.createElement("h2");
  productTitle.className = "m-content__card__content__header__title";
  productTitle.innerHTML = `<span>${product.brand}</span><span> / </span><span>${product.name}</span>`;

  const productInfo = document.createElement("div");
  productInfo.className = "m-content__card__content__info";

  const productPrice = document.createElement("p");
  productPrice.className = "m-content__card__content__info__final-price";
  productPrice.innerHTML = `${product.finalPrice} р. <span class="m-content__card__content__info__price">${product.price} р.</span>`;

  const buttons = document.createElement("div");
  buttons.className = "m-content__card__content__info__btns";

  const basketBtn = document.createElement("button");
  basketBtn.className = "m-content__card__content__info__btns__basket";
  basketBtn.setAttribute("data-id", product.id);

  const buyBtn = document.createElement("button");
  buyBtn.className = "m-content__card__content__info__btns__buy";
  buyBtn.setAttribute("data-id", product.id);
  buyBtn.textContent = "Купить сейчас";

  const infoBtn = document.createElement("a");
  infoBtn.className = "m-content__card__content__info-button";
  infoBtn.textContent = "Больше информации о товаре";
  infoBtn.href = "#";

  // --- Сборка ---
  buttons.append(basketBtn, buyBtn);
  productHeader.append(productTitle);
  productInfo.append(productPrice, buttons);
  productContent.append(productHeader, productInfo, infoBtn);
  productCard.append(productImg, productContent);
  modalContent.append(closeBtn, productCard);
  app.append(modOverlay, modalContent);

  // --- Состояние кнопки ---
  function updateModalUI(inCart) {
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

  let inCart = document
    .querySelector(`.card__button[data-id="${product.id}"]`)
    ?.classList.contains("card__button-two");

  updateModalUI(inCart);

  // --- Обработчики ---
  basketBtn.addEventListener("click", () => {
    if (!inCart) {
      inCart = true;
      addProdInbasket(product.id, 1);
      showToast();
      changeTextInRedCircle();
      document.dispatchEvent(
        new CustomEvent("cart:change", {
          detail: { id: product.id, inCart: true },
        })
      );
    } else {
      cleanup();
      openBasket();
    }
  });

  buyBtn.addEventListener("click", () => {
    addProdInbasket(product.id, 1);
    showToast();
    changeTextInRedCircle();
    document.dispatchEvent(
      new CustomEvent("cart:change", {
        detail: { id: product.id, inCart: true },
      })
    );
    cleanup();
    openBasket();
  });

  document.addEventListener("cart:change", (e) => {
    const { id, inCart: state } = e.detail || {};
    if (String(id) === String(product.id)) {
      inCart = state;
      updateModalUI(state);
    }
  });

  const cleanup = () => {
    modalContent.remove();
    modOverlay.remove();
  };

  closeBtn.addEventListener("click", cleanup);
  modOverlay.addEventListener("click", cleanup);

  // --- Показ ---
  requestAnimationFrame(() => {
    modalContent.classList.add("active");
    modOverlay.classList.add("active");
  });

  return { modalContent, modOverlay, cleanup };
}
