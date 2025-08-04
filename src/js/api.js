// export default products
export function getProductCards () {
  loadProductCards();
if (localStorage.getItem('cards') != null) {
  return JSON.parse(localStorage.getItem('cards'));
} else {
  return []
}
}
function loadProductCards () {
    const url = 'https://6888970cadf0e59551ba8c1c.mockapi.io/api/cards';
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error('Ошибка сети');
    return response.json();
  })
  .then(data => {
    localStorage.setItem('cards', JSON.stringify(data));
    console.log('Данные сохранены в localStorage:', data);
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });
}