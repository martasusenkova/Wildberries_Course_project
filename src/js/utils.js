export function getCard (id) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards.find(item => item.id === id);
}
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function throttle(fn, ms) {
  let last = 0;
  let t;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    } else {
      clearTimeout(t);
      t = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, ms - (now - last));
    }
  };
}