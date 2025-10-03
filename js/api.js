const API_URL = 'https://fakestoreapi.com/products';
 async function fetchProducts(){
    try{
        const response = await fetch(API_URL);
        if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
        return await response.json();
    } 
    catch (error){
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products after multiple attempts. Please check your internet connection and try again.');
    }
}

 async function fetchCategories(){
    try{
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok){throw new Error(`HTTP error! status: ${response.status}`);}
        return await response.json();
    } 
    catch (error){
        console.error('Error fetching categories:', error);
         return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    }
}
