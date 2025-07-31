export function OpenModalWindow(cardId) {
    const modalElement = document.getElementsByClassName("modal-content");
    console.log(modalElement);
    if (modalElement.length === 0) { ModalWindow(); } else { modalElement[0].classList.add('active'); }
}
export function ModalWindow() {
    console.log("ModalWindow");
    const productCardEntity = findCard("")
    // Создаём карточку товара
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-content__close-button';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => modalContent.classList.remove('active');

    const productCard = document.createElement('div');
    productCard.className = 'modal-content__product-card';

    const productImg = document.createElement('img');
    productImg.className = 'modal-content__product-img';
    productImg.src = productCardEntity.image;
    productImg.alt = 'Товар';

    const productInfo = document.createElement('div');
    productInfo.className = 'modal-content__product-card__info';

    const productTitle = document.createElement('h2');
    productTitle.className = 'modal-content__product-card__title';

    const brandSpan = document.createElement('span');
    brandSpan.textContent = productCardEntity.brand;
    const titleSpan = document.createElement('span');
    titleSpan.textContent = productCardEntity.name;
    const separatorSpan = document.createElement('span');
    separatorSpan.textContent = " / ";
    productTitle.appendChild(brandSpan);
    productTitle.appendChild(separatorSpan);
    productTitle.appendChild(titleSpan);

    const productPrice = document.createElement('p');
    productPrice.className = 'modal-content__product-card__final-price';
    productPrice.textContent = productCardEntity.finalPrice + ' р. ';
    const priceSpan = document.createElement('span');
    priceSpan.textContent = productCardEntity.price + ' р.';
    priceSpan.className = "modal-content__product-card__price"
    productPrice.appendChild(priceSpan);

    const buttons = document.createElement('div');
    buttons.className = 'modal-content__product-card__buttons';

    const basketBtn = document.createElement('button');
    basketBtn.className = 'modal-content__product-card__buttons__basket-button';
    basketBtn.textContent = 'Добавить в корзину';
    const buyBtn = document.createElement('button');
    buyBtn.className = 'modal-content__product-card__buttons__buy-button';
    buyBtn.textContent = 'Купить сейчас';

    // Собираем
    buttons.appendChild(basketBtn);
    buttons.appendChild(buyBtn);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(buttons);

    productCard.appendChild(productImg);
    productCard.appendChild(productInfo);

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(productCard);

    document.body.appendChild(modalContent);
    modalContent.classList.add('active');
    // Закрытие по клику вне окна
    modalContent.onclick = (e) => {
        if (e.target === modalContent) modalContent.classList.remove('active');
    };
}
function findCard(cardId) {
    const arrCards = JSON.parse(localStorage.getItem('cards'));
    return arrCards[1];
}