// Tworze karte i definiuje co ma sie w niej znajdowac
module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {}; // przpisuje tu elementy ze starej karty lub jesli nie sa zdefiniowane to pusty obiekt
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

// dodawanie nowych produktów do karty
    this.add = function (item, id) {
        var storedItem = this.items[id];
        // jesli dodaje do karty nowy produkt
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, quantity: 0, price: 0}
        }
        // jesli dodaje produkt, który juz jest w karcie
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }
    this.deleteItem=function (id){
        this.items[id].quantity--;
        this.items[id].price -=this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -=this.items[id].item.price;

        if(this.items[id].quantity <=0){
            delete this.items[id];
        }

    };

    // generowanie tablicy produktów
    this.generatearray = function () {
        const temp_arr = [];

        for (const id in this.items) {
            temp_arr.push(this.items[id]);
        }
        return temp_arr;
    }
};
