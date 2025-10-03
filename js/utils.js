 
function getLocalStorage(key){
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setLocalStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function addToFavorites(product){
    let favorites = getLocalStorage('favorites');
    if (!favorites.some(p => p.id === product.id)) {
        favorites.push(product);
        setLocalStorage('favorites', favorites);
    }
}

function removeFromFavorites(id){
    let favorites = getLocalStorage('favorites');
    favorites = favorites.filter(p => p.id !== id);
    setLocalStorage('favorites', favorites);
}

function addToCart(product, quantity = 1){
    let cart = getLocalStorage('cart');
    const existing = cart.find(p => p.id === product.id);
    if (existing){existing.quantity += quantity;}
    else{cart.push({ ...product, quantity });}
    setLocalStorage('cart', cart);
    updateCartBadge(); 
}

function updateCartQuantity(id, quantity){
    let cart = getLocalStorage('cart');
    const item = cart.find(p => p.id === id);
    if (item){
        item.quantity = quantity;
        setLocalStorage('cart', cart);
    }
}

function removeFromCart(id){
    let cart = getLocalStorage('cart');
    cart = cart.filter(p => p.id !== id);
    setLocalStorage('cart', cart);
    updateCartBadge(); 
}
 function updateCartBadge(){
    const cart = getLocalStorage('cart');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-badge');

    if (badge){
        if (totalItems > 0){
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        }
        else{badge.classList.add('hidden');}
    }
}
 function initCartBadge() {
    updateCartBadge();
}
