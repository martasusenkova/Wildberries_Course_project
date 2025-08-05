import { app } from "../main.js";

const toast = document.createElement('div');
toast.classList.add('toast'); 
toast.textContent = 'Товар добавлен в корзину';
app.appendChild(toast); 
 export function showToast() {
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000); // Скрываем через 5 секунд
}
document.getElementById('cardButton').addEventListener('click', showToast);