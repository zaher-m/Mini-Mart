let allProducts = []; 
let currentCategory = 'all'; 
let currentPage = 0;
const productsPerPage = 6;

document.addEventListener('DOMContentLoaded', async () =>{
    document.querySelector('.shop-now-btn').addEventListener('click', () =>{
        document.querySelector('.new-arrivals').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.icon-hamburger').addEventListener('click', () =>{
        document.querySelector('.menu').classList.toggle('hidden');
    });
    setupProductNavigation();
    showLoading();
    const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories()
    ]);
    allProducts = products;
    buildCategoryButtons(categories);
    displayProducts(allProducts);
    setupProductEventListeners();
    initCartBadge();
    document.getElementById('search-input').addEventListener('input', (e) =>{
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p =>{
            return (searchTerm === '' || p.title.toLowerCase().includes(searchTerm)) && 
                   (currentCategory === 'all' || p.category === currentCategory);
        });
        currentPage = 0;
        displayProducts(filtered);
    });
});

function displayProducts(products){
    const productsGrid = document.querySelector('.products-grid');
    const currentProducts = products.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);
    productsGrid.innerHTML = '';
    if (currentProducts.length === 0){productsGrid.innerHTML = '<div class="no-products">No products found</div>'; return;}
    currentProducts.forEach(product =>{
        productsGrid.appendChild(createProductElement(product));
    });
    updateNavigationButtons(products.length);
}

function updateNavigationButtons(totalProducts){
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = (currentPage + 1) * productsPerPage >= totalProducts;
}

function createProductElement(product){
    const item = document.createElement('div');
    item.classList.add('product-item');
    const favorites = getLocalStorage('favorites');
    const isFavorited = favorites.some(fav => fav.id === product.id);
    item.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                <span class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${product.id}">
                    ${isFavorited ? '❤️' : '🤍'}
                </span>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>`;
    return item;
}

function buildCategoryButtons(categories){
    const filterContainer = document.querySelector('.filter-buttons');
    filterContainer.innerHTML = '<button class="filter-btn active" data-category="all">All Products</button>';
    
    categories.forEach(category =>{
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.dataset.category = category;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterContainer.appendChild(button);
    });
    document.querySelectorAll('.filter-btn').forEach(btn =>{
        btn.addEventListener('click', (e) =>{
            document.querySelectorAll('.filter-btn').forEach(b =>{b.classList.remove('active');});
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;     
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const filtered = allProducts.filter(p =>{
                return (searchTerm === '' || p.title.toLowerCase().includes(searchTerm)) && 
                       (currentCategory === 'all' || p.category === currentCategory);
            });
            currentPage = 0;
            displayProducts(filtered);
        });
    });
}

function showLoading(){
    document.querySelector('.products-grid').innerHTML = '<div class="loading">Loading products</div>';
}
function setupProductEventListeners(){
    const productsContainer = document.querySelector('.products-grid');
    productsContainer.addEventListener('click', (e) =>{
        if (e.target.classList.contains('favorite-btn')){
            const id = parseInt(e.target.dataset.id);
            const product = allProducts.find(p => p.id === id);
            const favorites = getLocalStorage('favorites');
            const isFavorited = favorites.some(fav => fav.id === id);
            
            if (isFavorited){
                removeFromFavorites(id);
                e.target.innerHTML = '🤍';
                e.target.classList.remove('favorited');
            } 
            else{
                addToFavorites(product);
                e.target.innerHTML = '❤️';
                e.target.classList.add('favorited');
            }
        }
        if (e.target.classList.contains('add-to-cart-btn')){
            const id = parseInt(e.target.dataset.id);
            const product = allProducts.find(p => p.id === id);
            addToCart(product);
        }
    });
}

function setupProductNavigation(){
    const existingNav = document.querySelector('.product-navigation');
    if (existingNav){existingNav.remove();}
    const prevBtn = document.createElement('button');
    prevBtn.className = 'prev-btn';
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = true;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'next-btn';
    nextBtn.textContent = 'Next →';
    
    const navigation = document.createElement('div');
    navigation.className = 'product-navigation';
    navigation.appendChild(prevBtn);
    navigation.appendChild(nextBtn);
    prevBtn.addEventListener('click', () =>{
        currentPage--;
        displayProducts(allProducts);
    });
    nextBtn.addEventListener('click', () =>{
        currentPage++;
        displayProducts(allProducts);
    });
    document.querySelector('.products-grid').parentNode.insertBefore(navigation, document.querySelector('.products-grid'));
}
