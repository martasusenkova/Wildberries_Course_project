import { openModalWindow } from "./ProductCardModal.js";
import { app } from "../main.js";
import { showToast } from "./toast.js";
import { addProdInbasket } from "../js/localStorage.js";
import { openBasket } from "./Basket.js";
import { changeTextInRedCircle } from "./Header.js";import { getProductCards } from "../js/api.js";
import { delay, throttle } from "../js/utils.js"
const BATCH_SIZE = 20;
const state = {
  allProducts: [],
  offset: 0,
  done: false,
  loading: false,
  observer: null,
};
function getOrCreateContainer() {
  let container = document.querySelector(".productContainer");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("productContainer");
    app.appendChild(container);
  }
  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("card__show-button")) {
      const cardId = event.target.dataset.id;
      openModalWindow(cardId);

    }
  });
  return container;
}

// Глобальный слушатель для синхронизации кнопок корзины
if (!document._cartListenerAdded) {
  document._cartListenerAdded = true;

  document.addEventListener("cart:change", (e) => {
    const { id, inCart } = e.detail || {};
    if (!id) return;

    // Обновляем все кнопки карточек на странице
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

    // Обновляем кнопку в модалке
    const modalBtn = document.querySelector(`.m-content__card__content__info__btns__basket[data-id="${id}"]`);
    if (modalBtn) {
      if (inCart) {
        modalBtn.textContent = "Перейти в корзину!";
        modalBtn.classList.add("card__button-two");
        const buy = document.querySelector(`.m-content__card__content__info__btns__buy[data-id="${id}"]`);
        if (buy) buy.style.display = "none";
      } else {
        modalBtn.textContent = "Добавить в корзину";
        modalBtn.classList.remove("card__button-two");
        const buy = document.querySelector(`.m-content__card__content__info__btns__buy[data-id="${id}"]`);
        if (buy) buy.style.display = "";
      }
    }
  });
}

export function createCard(products, container, options = {}) {
  // Если продуктов нет — не продолжаем
  if (!products || products.length === 0) return;
  const append = options.append === true;
  // Очищаем контейнер перед добавлением новых карточек
  if (!append) {
    container.innerHTML = "";
  }

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
        <h2 class="card__name-wrap">
          <span class="card__brand">${product.brand}</span>
          <span class="card__name"> / ${product.name}</span>
        </h2>
        <p class="card__reviews">
          <span class="card__evaluation">4,9</span>
          <span class="card__opinion"> 1519 оценок </span>
        </p>
      </div>
    `;

    // Кнопка "Корзина"
    const cardButton = document.createElement("button");
    cardButton.classList.add("card__button");
    cardButton.setAttribute("data-id", product.id);
    cardButton.innerHTML = `
      <svg class="card__icon" width="17" height="16" fill="#A73AFD" xmlns="http://www.w3.org/2000/svg">
        <path class="card__icon-path" d="M2.925.488a.833.833 0 0 0-1.517.691l4.295 9.416v.001c.005.008.023.05.046.09a.9.9 0 0 0 .979.446c.045-.01.089-.023.098-.026l6.22-1.853.105-.031c.44-.13.867-.256 1.201-.523.29-.232.517-.535.657-.88.16-.396.159-.842.158-1.3V4.105c0-.01 0-.06-.004-.11a.901.901 0 0 0-.488-.73.9.9 0 0 0-.447-.098H4.147L2.925.487ZM11.833 12a1.333 1.333 0 0 0 0 2.667h.007a1.333 1.333 0 0 0 0-2.667h-.007ZM3.167 13.334c0-.737.597-1.334 1.333-1.334h.007a1.333 1.333 0 0 1 0 2.667H4.5a1.333 1.333 0 0 1-1.333-1.333Z" fill="#A73AFD"/>
      </svg>
      <p>Корзина</p>
    `;
    
    cardButton.addEventListener("click", (event) => {
      const btn = event.currentTarget;
      const id = btn.dataset.id;

      if (!btn.classList.contains("card__button-two")) {
        const p = btn.querySelector("p");
        if (p) p.textContent = "В корзине!";
        btn.classList.add("card__button-two");
    addProdInbasket(id, 1);
        showToast();
        changeTextInRedCircle();

        document.dispatchEvent(new CustomEvent("cart:change", {
          detail: { id, inCart: true }
        }));
      } else {
        openBasket();
      }
    });

    // Кнопка "Быстрый просмотр"
    const cardShowButton = document.createElement("button");
    cardShowButton.classList.add("card__show-button");
    cardShowButton.innerText = "Быстрый просмотр";
    cardShowButton.setAttribute("data-id", product.id);

    card.append(cardButton, cardShowButton);
    container.appendChild(card);
  });

  return container;
}
// делаем контейнер, который будет внизу страницы и сигнализировать, когда пересекает область видимости
function getOrCreateLoader() {
  let loader = document.querySelector(".loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.className = "loader";
    loader.setAttribute("role", "status");
    loader.style.cssText = "padding:16px;color:#666;text-align:center";
    loader.textContent = "Загрузка…";
    app.appendChild(loader);
  }
  return loader;
}
function setupObserver(loader, callback) {
  if ("IntersectionObserver" in window) {
    state.observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) callback();
      });
    }, { root: null, rootMargin: "400px 0px", threshold: 0 });
    state.observer.observe(loader);
  } else {
    window.addEventListener("scroll", throttle(() => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom) callback();
    }, 200));
  }
}
function renderNextBatch(container, loader, first = false) {
  if (state.loading || state.done) return;
  state.loading = true;

  // await delay(500);
  const slice = state.allProducts.slice(state.offset, state.offset + BATCH_SIZE);
  if (slice.length === 0) {
    state.offset = 0;
    state.loading = false;
    renderNextBatch(container, loader, false);
    // return;
    // state.done = true;
    // loader.textContent = "Больше нет товаров";
    // if (state.observer) state.observer.unobserve(loader);
    // state.loading = false;
    // return;
  }

  if (first) {
    createCard(slice, container, { append: false });
  } else {
    createCard(slice, container, { append: true });
  }

  state.offset += slice.length;
  loader.textContent = "";
  state.loading = false;

  // Если контент ниже высоты окна, еще загрузим
  if (document.body.offsetHeight < window.innerHeight && !state.done) {
    renderNextBatch(container, loader, true);
  }
}
export function initProductsInfinite() {
  const container = getOrCreateContainer();
  const loader = getOrCreateLoader();

  // сброс состояния
  state.offset = 0;
  state.done = false;
  state.loading = false;
  if (state.observer) {
    state.observer.disconnect();
    state.observer = null;
  }
  loader.textContent = "Загрузка…";

  state.allProducts = getProductCards();
  renderNextBatch(container, loader, true);
  setupObserver(loader, () => renderNextBatch(container, loader, false));
  return container;
}