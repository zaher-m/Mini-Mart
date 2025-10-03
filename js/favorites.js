 
document.addEventListener('DOMContentLoaded', () =>{
    displayFavorites();
     document.querySelector('.icon-hamburger').addEventListener('click', () =>{
        document.querySelector('.menu').classList.toggle('hidden');
    });
});

function displayFavorites(){
    const favorites = getLocalStorage('favorites');
    renderFavoriteItems(favorites);
}

function renderFavoriteItems(items){
    const container = document.getElementById('favorites-items');
    container.innerHTML = '';
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <h3>No favorites yet!</h3>
                <p>Start adding products to your favorites by clicking the ❤️ icon on any product.</p>
                <a href="index.html" style="color: #007bff; text-decoration: none; font-weight: bold;">Browse Products →</a>
            </div>`;
        return;
    }
    items.forEach(item =>{
        const favItem = document.createElement('div');
        favItem.classList.add('favorite-item');
        favItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" >
            <div class="favorite-item-details">
                <h3 class="favorite-item-title">${item.title}</h3>
                <p class="favorite-item-price">$${item.price}</p>
                <p class="favorite-item-category">${item.category}</p>
                <div class="favorite-actions">
                    <button class="remove-fav-btn" data-id="${item.id}">Remove</button>
                    <button class="add-to-cart-from-fav" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>`;
        container.appendChild(favItem);
    });
     document.querySelectorAll('.remove-fav-btn').forEach(btn =>{
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromFavorites(id);
            displayFavorites();
        });
    });

    document.querySelectorAll('.add-to-cart-from-fav').forEach(btn =>{
        btn.addEventListener('click', (e) =>{
            const id = parseInt(e.target.dataset.id);
            const favorites = getLocalStorage('favorites');
            const product = favorites.find(p => p.id === id);
            if (product){
                addToCart(product);
                alert('Added to cart!');
            }
        });
    });
}