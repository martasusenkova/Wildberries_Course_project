// создание header
export function createHeader() {
  const header = document.createElement("header");
  const wrapper = document.createElement("div");
  wrapper.classList.add("header__wrapper");

  const logo = document.createElement("a");
  logo.classList.add("header__logo");
  logo.href = "#app";

  const inputSearch = document.createElement("input");
  inputSearch.classList.add("header__searchInput");
  inputSearch.placeholder = "Найти на Wildberries";

  const btnBasket = document.createElement("button");
  btnBasket.classList.add("header__btnBasket");
  btnBasket.innerHTML = "Корзина";

  wrapper.append(logo, inputSearch, btnBasket);
  header.append(wrapper);

  return { header, inputSearch, logo };
}

//создание tabBar
export function createTabBar() {
  const tabBar = document.createElement("div");
  tabBar.classList.add("tabBar");

  const btnHome = document.createElement("a");
  btnHome.classList.add("tabBar__home");
  btnHome.href = "#app";

  const btnBasketTab = document.createElement("button");
  btnBasketTab.classList.add("tabBar__basket");

  tabBar.append(btnHome);
  tabBar.append(btnBasketTab);
  return tabBar;
}
