export function getCard (id) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards.find(item => item.id === id);
}