import { openModalWindow } from "./ProductCardModal.js";
import { showToast } from "./Toast.js";
import { addProdInbasket } from "../js/localStorage.js";
import { openBasket } from "./Basket.js";
import { changeTextInRedCircle } from "./Header.js";
import { getProductCards } from "../js/api.js";
import { delay, throttle } from "../js/utils.js";

const BATCH_SIZE = 20;

const state = {
  allProducts: [],
  offset: 0,
  done: false, //  used только если нет продуктов вообще
  loading: false,
  observer: null,
  scrollHandler: null, // для fallback
};
export { state };

// ======================== Контейнер карточек ========================
function getOrCreateContainer() {
  let container = document.querySelector(".productContainer");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("productContainer");
    const root = document.getElementById("app") || document.body;
    root.appendChild(container);
  }

  container.addEventListener("click", (event) => {
    if (event.target.classList.contains("card__show-button")) {
      const cardId = event.target.dataset.id;
      openModalWindow(cardId);
    }
  });

  return container;
}

// ======================== Глобальный слушатель корзины ========================
document.addEventListener("cart:change", (e) => {
  const { id, inCart } = e.detail || {};

  let pageButtons;
  if (id) {
    pageButtons = document.querySelectorAll(`.card__button[data-id="${id}"]`);
  } else {
    pageButtons = document.querySelectorAll(".card__button");
  }

  pageButtons.forEach((btn) => {
    const p = btn.querySelector("p");
    const icon = btn.querySelector(".card__icon");
    if (inCart) {
      if (p) p.textContent = "В корзине!";
      btn.classList.add("card__button-two");
      if (icon) icon.style.display = "none";
    } else {
      if (p) p.textContent = "Добавить в корзину";
      btn.classList.remove("card__button-two");
      if (icon) icon.style.display = "";
    }
  });

  const modalBtns = id
    ? [
        document.querySelector(
          `.m-content__card__content__info__btns__basket[data-id="${id}"]`
        ),
      ]
    : document.querySelectorAll(
        `.m-content__card__content__info__btns__basket`
      );

  modalBtns.forEach((modalBtn) => {
    if (!modalBtn) return;
    const buy = document.querySelector(
      `.m-content__card__content__info__btns__buy[data-id="${modalBtn.dataset.id}"]`
    );
    if (inCart) {
      modalBtn.textContent = "Перейти в корзину!";
      modalBtn.classList.add("card__button-two");
      if (buy) buy.style.display = "none";
    } else {
      modalBtn.textContent = "Добавить в корзину";
      modalBtn.classList.remove("card__button-two");
      if (buy) buy.style.display = "";
    }
  });
});

// ======================== Создание карточек ========================
export function createCard(products, container, options = {}) {
  if (!products || products.length === 0) return;
  const append = options.append === true;
  if (!append) container.innerHTML = "";

  const fragment = document.createDocumentFragment();

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
          <span class="card__initialPrice">${product.price} р</span>
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
      <p>Добавить в корзину</p>
    `;

    cardButton.addEventListener("click", (event) => {
      const btn = event.currentTarget;
      const id = btn.dataset.id;
      const icon = btn.querySelector(".card__icon");

      if (!btn.classList.contains("card__button-two")) {
        const p = btn.querySelector("p");
        if (p) p.textContent = "В корзине!";
        btn.classList.add("card__button-two");

        if (icon) icon.style.display = "none";

        addProdInbasket(id, 1);
        showToast();
        changeTextInRedCircle();

        document.dispatchEvent(
          new CustomEvent("cart:change", { detail: { id, inCart: true } })
        );
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
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  return container;
}

// ======================== Лоадер ========================
function getOrCreateLoader(container) {
  let loader = document.querySelector(".loader-scroll");
  if (!loader) {
    loader = document.createElement("div");
    loader.className = "loader-scroll";
    loader.setAttribute("role", "status");
    loader.style.cssText = "padding:16px;color:#666;text-align:center";
    loader.textContent = "Загрузка…";
    // вставляем loader прямо после контейнера
    if (container && container.parentNode) {
      container.parentNode.insertBefore(loader, container.nextSibling);
    } else {
      (document.getElementById("app") || document.body).appendChild(loader);
    }
  } else {
    // переместим loader рядом с контейнером, если нужно
    if (container && loader.parentNode !== container.parentNode) {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      container.parentNode.insertBefore(loader, container.nextSibling);
    }
  }
  return loader;
}

// ======================== Observer ========================
function setupObserver(loader, callback) {
  // отключаем старый observer, если есть
  if (state.observer) {
    try {
      state.observer.disconnect();
    } catch {}
    state.observer = null;
  }
  // удаляем старый scrollHandler если был
  if (state.scrollHandler) {
    try {
      window.removeEventListener("scroll", state.scrollHandler);
    } catch {}
    state.scrollHandler = null;
  }

  if ("IntersectionObserver" in window) {
    state.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) callback();
        });
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 }
    );
    state.observer.observe(loader);
  } else {
    // fallback на scroll
    const handler = throttle(() => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom) callback();
    }, 200);
    state.scrollHandler = handler;
    window.addEventListener("scroll", handler);
  }
}

// ======================== Подгрузка следующей партии ========================
async function renderNextBatch(container, loader, first = false) {
  if (state.loading) return;
  state.loading = true;

  loader.textContent = "Загрузка…";

  await delay(500);

  // отладочные логи
  console.log(
    "[Infinite] offset:",
    state.offset,
    " total:",
    state.allProducts ? state.allProducts.length : 0
  );

  if (!state.allProducts || state.allProducts.length === 0) {
    // нет данных вообще — пометим как закончено
    state.done = true;
    loader.textContent = "Больше товаров нет";
    state.loading = false;
    if (state.observer) {
      try {
        state.observer.disconnect();
      } catch {}
      state.observer = null;
    }
    return;
  }

  // получаем слайс; если он пуст (дошли до конца), сбрасываем offset в 0 и пробуем снова
  let slice = state.allProducts.slice(state.offset, state.offset + BATCH_SIZE);

  if (slice.length === 0) {
    // достигли конца, но есть продукты — сбрасываемся и снова берём партию
    console.log("[Infinite] reached end, looping to start");
    state.offset = 0;
    slice = state.allProducts.slice(0, BATCH_SIZE);
    // если всё ещё пусто — завершаем
    if (!slice || slice.length === 0) {
      state.done = true;
      loader.textContent = "Больше товаров нет";
      state.loading = false;
      if (state.observer) {
        try {
          state.observer.disconnect();
        } catch {}
        state.observer = null;
      }
      return;
    }
  }

  // рендерим партию
  createCard(slice, container, { append: !first });
  state.offset += slice.length;

  loader.textContent = "";
  state.loading = false;

  // если после добавления содержимого страница всё ещё короче экрана — грузим ещё (рекурсивно)
  if (document.body.offsetHeight < window.innerHeight && !state.done) {
    await renderNextBatch(container, loader, false);
  }
}

// ======================== Управление инициализацией ========================
export function destroyProductsInfinite() {
  try {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
  } catch (err) {}
  // удаляем loader, если есть
  const loader = document.querySelector(".loader-scroll");
  if (loader) {
    try {
      loader.remove();
    } catch {}
  }
  // удаляем scrollHandler если есть
  if (state.scrollHandler) {
    try {
      window.removeEventListener("scroll", state.scrollHandler);
    } catch {}
    state.scrollHandler = null;
  }

  state.allProducts = [];
  state.offset = 0;
  state.done = false;
  state.loading = false;
}

export async function initProductsInfinite() {
  destroyProductsInfinite();

  const container = getOrCreateContainer();
  const loader = getOrCreateLoader(container);

  state.offset = 0;
  state.done = false;
  state.loading = false;

  // Загружаем ВСЕ товары из API (getProductCards теперь асинхронный)
  try {
    state.allProducts = await getProductCards();
    console.log("[Infinite] loaded products:", state.allProducts?.length);
  } catch (err) {
    console.error("[Infinite] failed to load products:", err);
    state.allProducts = [];
  }

  await renderNextBatch(container, loader, true);

  setupObserver(loader, () => renderNextBatch(container, loader, false));

  return container;
}
