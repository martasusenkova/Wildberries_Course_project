import "../styles/basket.scss";
import { app } from "../main";
import { getCard } from "../js/utils";
import { editProdInbasket, deleteProdInbasket, countProdInBasket } from "../js/localStorage";
import { changeTextInRedCircle } from "./Header";

export let countProducts = countProdInBasket();
let initialPrice = 0;
let finalPrice = 0;

const basket = document.createElement('div');
basket.classList.add('basket');
basket.id = 'basket';

//функция окрытия корзины
export function openBasket() {
    if ((localStorage.getItem('basket') === null) || (JSON.parse(localStorage.getItem('basket')).length === 0))
        createEmptyBasket();
    else
        createFillBasket();
}

// создание пустой корзины
function createEmptyBasket() {
    document.body.style.overflow = 'hidden';
    basket.classList.remove('non-active');
    const emptyBasket = document.createElement('div');
    emptyBasket.classList.add('basket__container_empty', 'basket');
    emptyBasket.setAttribute('height', '300px')
    const emptyBasketImage = document.createElement('img');
    emptyBasketImage.src = 'src/assets/basket/cart.webp';
    emptyBasketImage.classList.add('basket__image');
    const emptyBasketTitle = document.createElement('p');
    emptyBasketTitle.classList.add('basket__title');
    emptyBasketTitle.textContent = 'В корзине пока пусто';
    const emptyBasketSubtitle = document.createElement('p');
    emptyBasketSubtitle.classList.add('basket__subtitle');
    emptyBasketSubtitle.textContent = 'Загляните на главную — собрали там товары, которые могут вам понравиться';
    const emptyBasketHome = document.createElement('button');
    emptyBasketHome.classList.add('basket__btn-home');
    emptyBasketHome.textContent = 'Перейти на главную';

    emptyBasket.append(emptyBasketImage);
    emptyBasket.append(emptyBasketTitle);
    emptyBasket.append(emptyBasketSubtitle);
    emptyBasket.append(emptyBasketHome);

    // Обёртка для фона
    const overlay = document.createElement('div');
    overlay.classList.add('basket__overlay');
    overlay.append(emptyBasket);

    // Клик мимо корзины
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            basket.classList.add('non-active');
            document.body.style.overflow = '';
            overlay.remove();
        }
    });
    emptyBasketHome.onclick = () => {
        basket.classList.add('non-active');
        overlay.remove();
    }

    basket.append(overlay);
    app.append(basket);
}

function isBasketEmpty() {
    if (countProducts == 0) {
        document.getElementById('fillBasket').remove();
        createEmptyBasket();
    }
}

function changingCountProduct() {
    document.getElementById('basketSubtitle').textContent = `${countProducts} товаров`;
    document.getElementById('countOfProductsText').textContent = `Товары, ${countProducts} шт.`
}

function changingPrices() {
    document.getElementById('totalPriceNum').textContent = `${finalPrice} р.`;
    document.getElementById('countOfProductsNum').textContent = `${initialPrice} р.`;
    document.getElementById('myDiscontNum').textContent = `${finalPrice - initialPrice} р.`;
}

// создание карточки товара
function createCard(id, num) {
    let count = num;
    countProducts += num;
    const card = document.createElement('div');
    card.classList.add('basket__card');

    const item = getCard(id);

    //сщздание карточки товара в корзине
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo');
    const cardImg = document.createElement('img');
    cardImg.classList.add('cardImg');
    cardImg.src = item.image;
    const cardDesc = document.createElement('div');
    cardDesc.classList.add('basket__cardDesc');

    //строка цен
    let itemFinalPrice = parseInt(item.finalPrice);
    let itemInitialPrice = parseInt(item.price);
    initialPrice += itemInitialPrice * num;
    finalPrice += itemFinalPrice * num;
    const pricePhone = document.createElement('div');
    pricePhone.classList.add('basket__price-div', 'basket__price-div_phone');
    const finalPricePhone = document.createElement('span');
    finalPricePhone.classList.add('basket__card__finalPrice');
    finalPricePhone.textContent = `${itemFinalPrice * count} р.`;
    const initialPricePhone = document.createElement('span');
    initialPricePhone.classList.add('basket__card__initailPrice');
    initialPricePhone.textContent = `${itemInitialPrice * count} р.`;
    pricePhone.append(finalPricePhone);
    pricePhone.append(initialPricePhone);
    cardDesc.append(pricePhone);

    //строка товара\производителя
    const itemTitleProd = document.createElement('div');
    itemTitleProd.classList.add('basket__itemTitleProd');
    const itemTitle = document.createElement('span');
    itemTitle.textContent = item.name;
    const itemSlash = document.createElement('span');
    itemSlash.textContent = ', ';
    const itemProd = document.createElement('span');
    itemProd.textContent = item.brand;
    itemTitleProd.append(itemTitle);
    itemTitleProd.append(itemSlash);
    itemTitleProd.append(itemProd);
    cardDesc.append(itemTitleProd);

    //строка о доставке
    const itemDelivery = document.createElement('span');
    itemDelivery.textContent = 'доставка будет в ближайшее время';
    itemDelivery.classList.add('basket__itemDelivery');
    cardDesc.append(itemDelivery);

    //строка иконок для пк
    const cardIconsLaptop = document.createElement('div');
    cardIconsLaptop.classList.add('basket__cardIcons');
    const cardFavoriteLaptop = document.createElement('button');
    cardFavoriteLaptop.classList.add('basket__cardFavoriteLaptop', 'non-active');
    cardFavoriteLaptop.setAttribute("data-id", item.id);
    const cardDeleteLaptop = document.createElement('button');
    cardDeleteLaptop.classList.add('basket__cardDeleteLaptop');
    cardDeleteLaptop.setAttribute("data-id", item.id);
    cardDeleteLaptop.addEventListener('click', (event) => {
        countProducts -= count;
        initialPrice -= itemInitialPrice * count;
        finalPrice -= itemFinalPrice * count;
        const id = event.currentTarget.dataset.id;
        deleteProdInbasket(id);
        changeTextInRedCircle();
        changingPrices();
        changingCountProduct();
        isBasketEmpty();
        card.remove();
    });

    cardIconsLaptop.append(cardFavoriteLaptop);
    cardIconsLaptop.append(cardDeleteLaptop);
    cardDesc.append(cardIconsLaptop);

    cardInfo.append(cardImg);
    cardInfo.append(cardDesc);


    //счетчик товара и иконки "избранное" "удалить"
    const cardCountIcons = document.createElement('div');
    cardCountIcons.classList.add('basket__cardCountIcons')
    const cardCount = document.createElement('div');
    cardCount.classList.add('cardCount')
    const btnMinus = document.createElement('button');
    if (count === 1)
        btnMinus.setAttribute('disabled', '');
    btnMinus.textContent = '-';
    btnMinus.classList.add('btn__count');
    btnMinus.setAttribute("data-id", item.id);
    btnMinus.addEventListener('click', (event) => {
        count--;
        countProducts--;
        const id = event.currentTarget.dataset.id;
        editProdInbasket(id, -1);
        changingCountProduct();
        changeTextInRedCircle()
        if (count === 1)
            btnMinus.setAttribute('disabled', '');
        countNum.textContent = `${count}`;
        finalPricePhone.textContent = `${itemFinalPrice * count} р.`;
        initialPricePhone.textContent = `${itemInitialPrice * count} р.`;
        finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;
        initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;
        finalPrice -= itemFinalPrice;
        initialPrice -= itemInitialPrice;
        changingPrices();
        if (count < 99)
            btnPlus.removeAttribute('disabled');
    });
    const countNum = document.createElement('p');
    countNum.textContent = `${count}`;
    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.classList.add('btn__count');
    btnPlus.setAttribute("data-id", item.id);
    btnPlus.addEventListener('click', (event) => {
        btnMinus.removeAttribute('disabled');
        count++;
        countProducts++;
        const id = event.currentTarget.dataset.id;
        editProdInbasket(id, 1);
        changingCountProduct();
        countNum.textContent = `${count}`;
        finalPricePhone.textContent = `${itemFinalPrice * count} р.`;
        initialPricePhone.textContent = `${itemInitialPrice * count} р.`;
        finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;
        initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;
        finalPrice += itemFinalPrice;
        initialPrice += itemInitialPrice;
        changingPrices();
        changeTextInRedCircle()
        if (count >= 99)
            btnPlus.setAttribute('disabled', '');
    });
    cardCount.append(btnMinus);
    cardCount.append(countNum);
    cardCount.append(btnPlus);
    cardCountIcons.append(cardCount)

    const cardIcons = document.createElement('div');
    cardIcons.classList.add('basket__cardIcons');
    const cardFavoritePhone = document.createElement('button');
    cardFavoritePhone.classList.add('basket__cardFavoritePhone');
    cardFavoritePhone.setAttribute("data-id", item.id);
    const cardDeletePhone = document.createElement('button');
    cardDeletePhone.classList.add('basket__cardDeletePhone');
    cardDeletePhone.setAttribute("data-id", item.id);
    cardDeletePhone.addEventListener('click', (event) => {
        countProducts -= count;
        const id = event.currentTarget.dataset.id;
        deleteProdInbasket(id);
        changeTextInRedCircle()
        changingCountProduct();
        changingPrices();
        isBasketEmpty();
        card.remove();
    });

    cardIcons.append(cardFavoritePhone);
    cardIcons.append(cardDeletePhone);
    cardCountIcons.append(cardIcons);

    //цена товара при разрешении >1166
    const priceLaptop = document.createElement('div');
    priceLaptop.classList.add('basket__price-div_laptop');
    const finalPriceLaptop = document.createElement('span');
    finalPriceLaptop.classList.add('basket__card__finalPrice');
    finalPriceLaptop.textContent = `${itemFinalPrice * count} р.`;
    const initialPriceLaptop = document.createElement('span');
    initialPriceLaptop.classList.add('basket__card__initailPrice');
    initialPriceLaptop.textContent = `${itemInitialPrice * count} р.`;
    priceLaptop.append(finalPriceLaptop);
    priceLaptop.append(initialPriceLaptop);

    card.append(cardInfo);
    card.append(cardCountIcons);
    card.append(priceLaptop);
    return card;
}

// создание заполненный корзины
function createFillBasket() {
    //обнуление глобальных переменных при пересоздании корзины
    countProducts = 0;
    initialPrice = 0;
    finalPrice = 0;

    document.body.style.overflow = 'hidden';

    let count = 0;
    basket.classList.remove('non-active');

    const fillBasket = document.createElement('div');
    fillBasket.classList.add('basket__container_fill');
    fillBasket.id = 'fillBasket';

    //div с товарами
    const fillBasketProducts = document.createElement('div');
    fillBasketProducts.classList.add('basket__field_fill');

    const inBasket = JSON.parse(localStorage.getItem('basket'));
    inBasket.forEach(element => {
        fillBasketProducts.append(createCard(element.id, element.count));
    });

    //div с ценами
    const fillBasketPrice = document.createElement('div');
    fillBasketPrice.classList.add('basket__field_fill');

    const countOfProducts = document.createElement('div')
    countOfProducts.classList.add('basket__subtitle_fill', 'flex-space-b');
    const countOfProductsText = document.createElement('span');
    countOfProductsText.textContent = `Товары, ${countProducts} шт.`;
    countOfProductsText.id = 'countOfProductsText';
    const countOfProductsNum = document.createElement('span');
    countOfProductsNum.textContent = `${initialPrice} р.`
    countOfProductsNum.id = 'countOfProductsNum';
    countOfProducts.append(countOfProductsText);
    countOfProducts.append(countOfProductsNum);

    const myDiscont = document.createElement('div')
    myDiscont.classList.add('basket__subtitle_fill', 'flex-space-b');
    const myDiscontText = document.createElement('span');
    myDiscontText.textContent = `Моя скидка`
    const myDiscontNum = document.createElement('span');
    myDiscontNum.textContent = `${finalPrice - initialPrice} р.`;
    myDiscontNum.id = 'myDiscontNum';
    myDiscont.append(myDiscontText);
    myDiscont.append(myDiscontNum);

    const totalPrice = document.createElement('div')
    totalPrice.classList.add('basket__title_fill', 'flex-space-b');
    const totalPriceText = document.createElement('span');
    totalPriceText.textContent = `Итого`
    const totalPriceNum = document.createElement('span');
    totalPriceNum.textContent = `${finalPrice} р.`;
    totalPriceNum.id = 'totalPriceNum';
    totalPrice.append(totalPriceText);
    totalPrice.append(totalPriceNum);

    const btnOrder = document.createElement('button');
    btnOrder.classList.add('basket__btn-home');
    btnOrder.textContent = 'Заказать';

    // добавление параметров в див с ценами
    fillBasketPrice.append(countOfProducts);
    fillBasketPrice.append(myDiscont);
    fillBasketPrice.append(totalPrice);
    fillBasketPrice.append(btnOrder);



    // добавление дива товаров и дива цены в главный див
    fillBasket.append(fillBasketProducts);
    fillBasket.append(fillBasketPrice);

    const basketTitle = document.createElement('p');
    basketTitle.classList.add('basket__title_fill');
    basketTitle.textContent = 'Корзина';
    const basketSubtitle = document.createElement('p');
    basketSubtitle.classList.add('basket__subtitle_fill');
    basketSubtitle.textContent = `${countProducts} товаров`;
    basketSubtitle.id = 'basketSubtitle';

    fillBasketProducts.prepend(basketSubtitle);
    fillBasketProducts.prepend(basketTitle);

    // Обёртка для фона
    const overlay = document.createElement('div');
    overlay.classList.add('basket__overlay');
    overlay.append(fillBasket);

    // Клик мимо корзины
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            basket.classList.add('non-active');
            document.body.style.overflow = '';
            overlay.remove();
        }
    });

    btnOrder.onclick = () => {
        basket.classList.add('non-active');
        document.body.style.overflow = '';
        overlay.remove();
        localStorage.removeItem('basket');
        changeTextInRedCircle();
        createSuccessfulOrder();
    }

    basket.append(overlay);
    app.append(basket);
}


// создание пустой корзины
function createSuccessfulOrder() {
    document.body.style.overflow = 'hidden';
    basket.classList.remove('non-active');
    const emptyBasket = document.createElement('div');
    emptyBasket.classList.add('basket__container_empty', 'basket');
    emptyBasket.setAttribute('height', '300px')
    const emptyBasketImage = document.createElement('img');
    emptyBasketImage.src = 'src/assets/basket/deliveryCar.gif';
    emptyBasketImage.classList.add('basket__image');
    const emptyBasketTitle = document.createElement('p');
    emptyBasketTitle.classList.add('basket__title');
    emptyBasketTitle.textContent = 'ЗАКАЗ УСПЕШНО ОФОРМЛЕН И БУДЕТ ОТПРАВЛЕН В БЛИЖАЙШЕЕ ВРЕМЯ';
    const emptyBasketSubtitle = document.createElement('p');
    emptyBasketSubtitle.classList.add('basket__subtitle');
    emptyBasketSubtitle.textContent = 'Загляните на главную — возможно вы захотите заказать что-нибудь еще';
    const emptyBasketHome = document.createElement('button');
    emptyBasketHome.classList.add('basket__btn-home');
    emptyBasketHome.textContent = 'Перейти на главную';

    emptyBasket.append(emptyBasketImage);
    emptyBasket.append(emptyBasketTitle);
    emptyBasket.append(emptyBasketSubtitle);
    emptyBasket.append(emptyBasketHome);

    // Обёртка для фона
    const overlay = document.createElement('div');
    overlay.classList.add('basket__overlay');
    overlay.append(emptyBasket);

    // Клик мимо корзины
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            basket.classList.add('non-active');
            document.body.style.overflow = '';
            overlay.remove();
        }
    });
    emptyBasketHome.onclick = () => {
        basket.classList.add('non-active');
        overlay.remove();
    }

    basket.append(overlay);
    app.append(basket);
}