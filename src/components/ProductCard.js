import { openModalWindow } from "./ProductCardModal.js";
import { app } from "../main.js";
import { toast, showToast } from "./toast.js";

export function getOrCreateContainer() {
  let container = document.querySelector(".productContainer");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("productContainer");
    app.appendChild(container); 
  }
  return container;
}

export function createCard(products, container) {
  if (!products || products.length === 0) return { container, cards: [] };

  // Очищаем контейнер
  container.innerHTML = "";

  const createdCards = [];

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", product.id);

    
    card.innerHTML = `
      <div class="card__top-wrap">
        <img src="${product.image}" class="card__top-wrap__image" alt="${product.name}" />
      </div>
      <div class="card__sale-wrap">
        <p class="card__sale-wrap__sale"> -10% </p>
      </div>
      <div class="card__middle-wrap">
        <p class="card__price">
          <span class="card__finalPrice">${product.finalPrice} р.</span>
          <span class="card__initailPrice">${product.price} р</span>
        </p>
        <p class="card__name-wrap">
          <span class="card__brand">${product.brand}</span>
          <span class="card__name"> / ${product.name}</span>
        </p>
        <p class="card__reviews">
        <span class="card__evaluation">4,9</span>
        <span class="card__opinion"> 1519 оценок </span>
        </p>
      </div>
    `;

    // Создаём кнопку "в корзину" один раз
    const cardButton = document.createElement("button");
    cardButton.classList.add("card__button");
    cardButton.setAttribute("data-id", product.id);
    cardButton.innerHTML = `
      <svg class="card__icon" width="17" height="16" fill="#A73AFD" xmlns="http://www.w3.org/2000/svg">
        <path class="card__icon-path" d="M2.925.488a.833.833 0 0 0-1.517.691l4.295 9.416v.001c.005.008.023.05.046.09a.9.9 0 0 0 .979.446c.045-.01.089-.023.098-.026l6.22-1.853.105-.031c.44-.13.867-.256 1.201-.523.29-.232.517-.535.657-.88.16-.396.159-.842.158-1.3V4.105c0-.01 0-.06-.004-.11a.901.901 0 0 0-.488-.73.9.9 0 0 0-.447-.098H4.147L2.925.487ZM11.833 12a1.333 1.333 0 0 0 0 2.667h.007a1.333 1.333 0 0 0 0-2.667h-.007ZM3.167 13.334c0-.737.597-1.334 1.333-1.334h.007a1.333 1.333 0 0 1 0 2.667H4.5a1.333 1.333 0 0 1-1.333-1.333Z" fill="#A73AFD"/>
      </svg>
      <p>Корзина</p>
    `;

    // helper: меняет текст в <p>, не трогая SVG
    function changeTextToInCart() {
      const p = cardButton.querySelector("p");
      if (p) p.textContent = "В корзине!";
      cardButton.classList.add("card__button-two");
    }
// в начале файла (глобально в модуле) добавим флаг, чтобы слушатель добавлялся один раз
if (!document._cartListenerAdded) {
  document._cartListenerAdded = true;

  document.addEventListener("cart:change", (e) => {
    const { id, inCart } = e.detail || {};
    if (!id) return;

    // Обновить все кнопки карточек на странице
    const pageButtons = document.querySelectorAll(`.card__button[data-id="${id}"]`);
    pageButtons.forEach((btn) => {
      const p = btn.querySelector("p");
      if (inCart) {
        if (p) p.textContent = "В корзине!";
        btn.classList.add("card__button-two");
      } else {
        if (p) p.textContent = "Корзина";
        btn.classList.remove("card__button-two");
      }
    });

    // Также обновим кнопки внутри открытой модалки (если есть)
    const modalBtn = document.querySelector(`.m-content__card__content__info__btns__basket[data-id="${id}"]`);
    if (modalBtn) {
      if (inCart) {
        modalBtn.textContent = "Перейти в корзину!";
        modalBtn.classList.add("card__button-two");
        const buy = document.querySelector('.m-content__card__content__info__btns__buy[data-id="' + id + '"]');
        if (buy) buy.style.display = "none";
      } else {
        modalBtn.textContent = "Добавить в корзину";
        modalBtn.classList.remove("card__button-two");
        const buy = document.querySelector('.m-content__card__content__info__btns__buy[data-id="' + id + '"]');
        if (buy) buy.style.display = "";
      }
    }
  });
}
   cardButton.addEventListener("click", () => {
  // Меняем текст локально, не перестраивая SVG
  const p = cardButton.querySelector("p");
  if (p) p.textContent = "В корзине!";
  cardButton.classList.add("card__button-two");

  // Диспатчим событие, чтобы синхронизировать другие места (модалку и т.д.)
  document.dispatchEvent(new CustomEvent("cart:change", {
    detail: { id: product.id, inCart: true }
  }));
  showToast();
});

    // Быстрый просмотр
    const cardShowButton = document.createElement("button");
    cardShowButton.classList.add("card__show-button");
    cardShowButton.innerText = "Быстрый просмотр";
    cardShowButton.setAttribute("data-id", product.id);

    // Добавляем кнопки в карточку и карточку в контейнер
    card.append(cardButton, cardShowButton);
    container.appendChild(card);

    // Собираем ссылку на карточку
    createdCards.push(card);
  });

  // Делегирование клика для всех "быстрых просмотров"
  // (оставляем один обработчик, который сработает для новых элементов)
  container.addEventListener("click", (event) => {
    const showBtn = event.target.closest(".card__show-button");
    if (showBtn) {
      const cardId = showBtn.dataset.id;
      openModalWindow(cardId);
    }
  });

  // Возвращаем контейнер и массив карточек
  return { container, cards: createdCards };
}

