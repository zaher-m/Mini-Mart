document.addEventListener('DOMContentLoaded', () =>{
    displaySummary();
    document.querySelector('.icon-hamburger').addEventListener('click', () =>{
        document.querySelector('.menu').classList.toggle('hidden');
    });
    document.getElementById('checkout-form').addEventListener('submit', (e) =>{
        e.preventDefault();
        if (validateForm()){simulateOrderSubmission();}
    });
    document.getElementById('continue-shopping').addEventListener('click', () =>{
        window.location.href = 'index.html';
    });
});

function displaySummary(){
    const cart = getLocalStorage('cart');
    const container = document.getElementById('summary-items');
    container.innerHTML = '';
    
    if (cart.length === 0){
        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty!</h3>
                <p>Add some products to your cart first.</p>
                <button class="start-shopping" onclick="window.location.href='index.html'">Start Shopping →</button>
            </div>`;
        document.querySelector('.place-order-btn').disabled = true;
        return;
    }
    
    let total = 0;
    cart.forEach(item =>{
        const summaryItem = document.createElement('div');
        summaryItem.classList.add('summary-item');
        summaryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="summary-item-image">
            <div class="summary-item-info">
                <div class="summary-item-title">${item.title}</div>
                <div class="summary-item-details">
                    <span class="summary-item-quantity">Qty: ${item.quantity}</span>
                    <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>`;
        container.appendChild(summaryItem);
        total += item.price * item.quantity;
    });
    
    document.getElementById('summary-total-price').textContent = `$${total.toFixed(2)}`;
    document.querySelector('.place-order-btn').disabled = false;
}

function validateForm(){
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!name || !email || !address){
        alert('Please fill in all required fields.');
        return false;
    }
    return true;
}

function simulateOrderSubmission(){
    const cart = getLocalStorage('cart');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = 'ITI' + Date.now().toString().substr(-8);
    const submitButton = document.querySelector('.place-order-btn');
    
    submitButton.textContent = 'Processing Order...';
    submitButton.disabled = true;
    setTimeout(() =>{
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('success-modal').classList.remove('hidden');
        setLocalStorage('cart', []);
        document.getElementById('checkout-form').reset();
        submitButton.textContent = 'Place Order';
        submitButton.disabled = false;
    }, 2000);
}
