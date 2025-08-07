import { app } from "../main.js";
import { getCard } from "../js/utils";
import { showToast } from "./toast.js";

export function openModalWindow(cardId) {
  const modalContainer = document.querySelector(".m-content");
  if (modalContainer) {
    modalContainer.remove();
  }
    const modOverlay = document.querySelector('.m-overlay');
    if (modOverlay) {
        modOverlay.remove();
    }
  modalWindow(cardId);
  document.addEventListener("mousedown", onDocumentClick);
}
export function modalWindow(cardId) {
    const productCardEntity = getCard(cardId)
    // Создаём карточку товара
    const modalContent = document.createElement('div');
    modalContent.className = 'm-content';
    const modOverlay = document.createElement('div');
    modOverlay.className = 'm-overlay';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'm-content__close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        modalContent.classList.remove('active');
        modOverlay.classList.remove('active');
    }

    const productCard = document.createElement('div');
    productCard.className = 'm-content__card';

    const productImg = document.createElement('img');
    productImg.className = 'm-content__card__img';
    productImg.src = productCardEntity.image;
    productImg.alt = 'Товар';

    const productContent = document.createElement('div');
    productContent.className = 'm-content__card__content';

    const productHeader = document.createElement('div');
    productHeader.className = 'm-content__card__content__header';
    const productTitle = document.createElement('h2');
    productTitle.className = 'm-content__card__content__header__title';

  const brandSpan = document.createElement("span");
  brandSpan.textContent = productCardEntity.brand;
  const titleSpan = document.createElement("span");
  titleSpan.textContent = productCardEntity.name;
  const separatorSpan = document.createElement("span");
  separatorSpan.textContent = " / ";
  productTitle.appendChild(brandSpan);
  productTitle.appendChild(separatorSpan);
  productTitle.appendChild(titleSpan);

    const productInfo = document.createElement('div');
    productInfo.className = 'm-content__card__content__info';

    const productPrice = document.createElement('p');
    productPrice.className = 'm-content__card__content__info__final-price';
    productPrice.textContent = productCardEntity.finalPrice + ' р. ';
    const priceSpan = document.createElement('span');
    priceSpan.textContent = productCardEntity.price + ' р.';
    priceSpan.className = "m-content__card__content__info__price"
    productPrice.appendChild(priceSpan);

    const buttons = document.createElement('div');
    buttons.className = 'm-content__card__content__info__btns';

    const basketBtn = document.createElement('button');
    basketBtn.className = 'm-content__card__content__info__btns__basket';
    basketBtn.textContent = 'Добавить в корзину';
    basketBtn.setAttribute('data-id', productCardEntity.id);
    const buyBtn = document.createElement('button');
    buyBtn.className = 'm-content__card__content__info__btns__buy';
    buyBtn.textContent = 'Купить сейчас';
    buyBtn.setAttribute('data-id', productCardEntity.id);
    const infoBtn = document.createElement('a');
    infoBtn.className = 'm-content__card__content__info-button';
    infoBtn.textContent = 'Больше информации о товаре';

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
    app.appendChild(modOverlay);
  modalContent.classList.add("active");

  basketBtn.addEventListener("click", () => {
  changeText(basketBtn),
  showToast()
  });

  function changeText(basketBtn) {
    basketBtn.textContent = "Перейти в корзину!";
    basketBtn.classList.add("card__button-two");
    buyBtn.style.display = "none";
  }
    const modalOverlay = document.querySelector('.m-overlay')
    modalOverlay.classList.add('active');
}
function onDocumentClick(e) {
    // Если клик был вне modalContent
    const modalContent = document.querySelector('.m-content');
    const modOverlay = document.querySelector('.m-overlay')
    if (modalContent && modOverlay && !modalContent.contains(e.target)) {
        modalContent.classList.remove('active');
        modOverlay.classList.remove('active');
        document.removeEventListener('mousedown', onDocumentClick);
    }
}
