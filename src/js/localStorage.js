// localStorage.setItem('basket', JSON.stringify([]));

// функция добавления товара в localStorage
export function addProdInbasket(itemId, itemCount) {
    let newArr = [];
    if (localStorage.getItem('basket') !== null) {
        let isThere = false;
        const arr = JSON.parse(localStorage.getItem('basket'));
        arr.forEach((value)=> {
            if(value.id == itemId){
                isThere = true;
                value.count += itemCount;
                newArr = arr;
            }
        })
        if (!isThere)
            newArr = [...arr, { id: itemId, count: itemCount }]
    } else {
        newArr = [{ id: itemId, count: itemCount }]
    }

    localStorage.setItem('basket', JSON.stringify(newArr));
}

// функция изменения параметра count
export function editProdInbasket(itemId, itemCount) {
    const arr = JSON.parse(localStorage.getItem('basket'));
    arr.forEach((value) => {
        if (value.id == itemId)
            value.count += itemCount;
    })
    localStorage.setItem('basket', JSON.stringify(arr));
}

// функция удаления элемента 
export function deleteProdInbasket(itemId) {
    let arr = JSON.parse(localStorage.getItem('basket'));
    arr = arr.filter(item => item.id !== itemId);
    localStorage.setItem('basket', JSON.stringify(arr));
}

//функция подсчета количества товаров в корзине
export function countProdInBasket() {
    let sum = 0;
    if (localStorage.getItem('basket') !== null) {
        const arr = JSON.parse(localStorage.getItem('basket'));
        arr.forEach((value) => {
            sum += value.count;
        })
        return sum;
    }
    return 0;
}