document.addEventListener('DOMContentLoaded', () =>{
    displayCart();
    updateCartBadge();
    
    document.querySelector('.icon-hamburger').addEventListener('click', () =>{
        document.querySelector('.menu').classList.toggle('hidden');
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () =>{
        if (getLocalStorage('cart').length > 0){window.location.href = 'checkout.html';}
    });
});

function displayCart(){
    const cart = getLocalStorage('cart');
    renderCartItems(cart);
    updateTotal(cart);
    updateCartBadge();
}

function renderCartItems(items){
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    if (items.length === 0){
        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty!</h3>
                <p>Add some products to your cart to get started.</p>
                <button class="start-shopping" onclick="window.location.href='index.html'">Start Shopping →</button>
            </div>`;
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    items.forEach(item =>{
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${item.price} each</p>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>`;
        container.appendChild(cartItem);
    });
    
    document.querySelectorAll('.decrease-btn').forEach(btn =>{
        btn.addEventListener('click', (e) =>{
            const id = parseInt(e.target.dataset.id);
            const cart = getLocalStorage('cart');
            const item = cart.find(p => p.id === id);
            if (item.quantity > 1){
                updateCartQuantity(id, item.quantity - 1);
                displayCart();
            }
        });
    });

    document.querySelectorAll('.increase-btn').forEach(btn =>{
        btn.addEventListener('click', (e) =>{
            const id = parseInt(e.target.dataset.id);
            const cart = getLocalStorage('cart');
            const item = cart.find(p => p.id === id);
            updateCartQuantity(id, item.quantity + 1);
            displayCart();
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn =>{
        btn.addEventListener('click', (e) =>{
            removeFromCart(parseInt(e.target.dataset.id));
            displayCart();
        });
    });

    document.getElementById('checkout-btn').disabled = false;
}

function updateTotal(items){
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-btn').disabled = items.length === 0;
}

function updateCartBadge(){
    const cart = getLocalStorage('cart');
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0){
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}
