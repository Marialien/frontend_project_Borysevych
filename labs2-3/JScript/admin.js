document.addEventListener('DOMContentLoaded', () => {
    // Перевірка, чи користувач адміністратор
    if (localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Обробка виходу
    if (window.location.search === '?logout=true') {
        localStorage.removeItem('isAdmin');
        window.location.href = 'login.html';
        return;
    }

    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Функція для оновлення списку товарів
    function updateProductList() {
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = '';
            products.forEach((product, index) => {
                const div = document.createElement('div');
                div.innerHTML = `${product.name} (${product.category}) - ${product.price} грн <button onclick="removeProduct(${index})">Видалити</button>`;
                productList.appendChild(div);
            });
        }
    }

    // Функція для видалення товару
    window.removeProduct = (index) => {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        updateProductList();
    };

    // Обробка форми додавання товару
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const category = document.getElementById('product-category').value;
            const price = parseInt(document.getElementById('product-price').value);
            const image = document.getElementById('product-image').value;

            if (name && category && price >= 0 && image) {
                products.push({ name, category, price, image, alt: `${name} зображення` });
                localStorage.setItem('products', JSON.stringify(products));
                addProductForm.reset();
                updateProductList();
                alert('Товар додано успішно!');
            } else {
                alert('Заповніть усі поля коректно!');
            }
        });
    }

    updateProductList();
});