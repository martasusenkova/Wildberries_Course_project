// создание header
export function createHeader() {
  const header = document.createElement('header');
  const logo = document.createElement('a');
  logo.classList.add('header__logo');
  logo.href = '#app';
  const inputSearch = document.createElement('input');
  inputSearch.classList.add('header__searchInput');
  inputSearch.placeholder = 'Найти на Wildberries';
  const btnBasket = document.createElement('button');
  btnBasket.classList.add('header__btnBasket');
  btnBasket.innerHTML = 'Корзина';

  header.append(logo);
  header.append(inputSearch);
  header.append(btnBasket);
  return header;
}

//создание tabBar
export function createTabBar() {
  const tabBar = document.createElement('div');
  tabBar.classList.add('tabBar');
  const btnHome = document.createElement('a');
  btnHome.classList.add('tabBar__home');
  btnHome.href = '#app';
  const btnBasketTab = document.createElement('button');
  btnBasketTab.classList.add('tabBar__basket');

  tabBar.append(btnHome);
  tabBar.append(btnBasketTab);
  return tabBar;
}