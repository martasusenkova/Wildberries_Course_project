import { app } from "../main.js";
import { getCard } from "../js/utils";
export function openModalWindow(cardId) {
  const modalContainer = document.querySelector(".modal-content");
  if (modalContainer) {
    modalContainer.remove();
  }
  modalWindow(cardId);
  document.addEventListener("mousedown", onDocumentClick);
}
export function modalWindow(cardId) {
  const productCardEntity = getCard(cardId);
  // Создаём карточку товара
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeBtn = document.createElement("span");
  closeBtn.className = "modal-content__close-button";
  closeBtn.textContent = "×";
  closeBtn.onclick = () => modalContent.classList.remove("active");

  const productCard = document.createElement("div");
  productCard.className = "modal-content__product-card";

  const productImg = document.createElement("img");
  productImg.className = "modal-content__product-card__product-img";
  productImg.src = productCardEntity.image;
  productImg.alt = "Товар";

  const productContent = document.createElement("div");
  productContent.className = "modal-content__product-card__content";

  const productHeader = document.createElement("div");
  productHeader.className = "modal-content__product-card__content__header";
  const productTitle = document.createElement("h2");
  productTitle.className =
    "modal-content__product-card__content__header__title";

  const brandSpan = document.createElement("span");
  brandSpan.textContent = productCardEntity.brand;
  const titleSpan = document.createElement("span");
  titleSpan.textContent = productCardEntity.name;
  const separatorSpan = document.createElement("span");
  separatorSpan.textContent = " / ";
  productTitle.appendChild(brandSpan);
  productTitle.appendChild(separatorSpan);
  productTitle.appendChild(titleSpan);

  const productInfo = document.createElement("div");
  productInfo.className = "modal-content__product-card__content__info";

  const productPrice = document.createElement("p");
  productPrice.className =
    "modal-content__product-card__content__info__final-price";
  productPrice.textContent = productCardEntity.finalPrice + " р. ";
  const priceSpan = document.createElement("span");
  priceSpan.textContent = productCardEntity.price + " р.";
  priceSpan.className = "modal-content__product-card__content__info__price";
  productPrice.appendChild(priceSpan);

  const buttons = document.createElement("div");
  buttons.className = "modal-content__product-card__content__info__buttons";

  const basketBtn = document.createElement("button");
  basketBtn.className =
    "modal-content__product-card__content__info__buttons__basket-button";
  basketBtn.textContent = "Добавить в корзину";
  const buyBtn = document.createElement("button");
  buyBtn.className =
    "modal-content__product-card__content__info__buttons__buy-button";
  buyBtn.textContent = "Купить сейчас";
  const infoBtn = document.createElement("a");
  infoBtn.className = "modal-content__product-card__content__info-button";
  infoBtn.textContent = "Больше информации о товаре";

  // Собираем
  buttons.appendChild(basketBtn);
  buttons.appendChild(buyBtn);
  productHeader.appendChild(productTitle);
  productInfo.appendChild(productPrice);
  productInfo.appendChild(buttons);
  productContent.appendChild(productTitle);
  productContent.appendChild(productInfo);
  productContent.appendChild(infoBtn);

  productCard.appendChild(productImg);
  productCard.appendChild(productContent);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(productCard);

  app.appendChild(modalContent);
  modalContent.classList.add("active");

  basketBtn.addEventListener("click", () => changeText(basketBtn));

  function changeText(basketBtn) {
    basketBtn.textContent = "Перейти в корзину!";
    basketBtn.classList.add("card__button-two");
    buyBtn.style.display = "none";
  }
}
function onDocumentClick(e) {
  // Если клик был вне modalContent
  const modalContent = document.querySelector(".modal-content");
  if (modalContent && !modalContent.contains(e.target)) {
    modalContent.classList.remove("active");
    document.removeEventListener("mousedown", onDocumentClick);
  }
}
