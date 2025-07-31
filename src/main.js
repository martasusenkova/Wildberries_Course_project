import { ProductCard } from "./components/ProductCard.js";
import { Header } from "./components/Header.js";
import "./styles/style.scss";
getProductCards ();
ProductCard();
Header();

function getProductCards () {
    const url = 'https://6888970cadf0e59551ba8c1c.mockapi.io/api/cards';
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error('Ошибка сети');
    return response.json();
  })
  .then(data => {
    const id = crypto.randomUUID();
     const updatedData = data.map(obj => ({
      ...obj,         
      id: id  
    }));
    localStorage.setItem('cards', JSON.stringify(updatedData));
    console.log('Данные сохранены в localStorage:', updatedData);
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });
}
