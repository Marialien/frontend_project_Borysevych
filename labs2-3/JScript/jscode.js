let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let loadedProducts = [];
let productIndex = 0;
const PRODUCTS_PER_ROW = 3; // Залишаємо 3 картки за рядок

// Завантажуємо товари з localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];



// Функція createProductCard залишається без змін
function createProductCard(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.alt}">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>Ціна: ${product.price} грн</p>
        <button class="add-to-cart" onclick="addToCart(${productIndex - 1})">Додати в кошик</button>
        <button class="add-to-favorites" onclick="addToFavorites(${productIndex - 1})">Додати в обране</button>
    `;
    return productDiv;
}

// Функція для створення картки товару
function createProductCard(product) {
    const productElement = document.createElement('article');
    productElement.classList.add('product');
    productElement.setAttribute('data-category', product.category);
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.alt}">
        <h2>${product.name}</h2>
        <p>Ціна: ${product.price} грн</p>
        <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Додати в кошик</button>
        <button class="add-to-favorites" data-name="${product.name}" aria-label="Додати в улюблені">❤️</button>
    `;

    // Додаємо обробники подій
    const addToCartBtn = productElement.querySelector('.add-to-cart');
    const addToFavoritesBtn = productElement.querySelector('.add-to-favorites');

    addToCartBtn.addEventListener('click', () => {
        const name = addToCartBtn.getAttribute('data-name');
        const price = parseInt(addToCartBtn.getAttribute('data-price'));
        addToCart(name, price);
    });

    addToFavoritesBtn.addEventListener('click', () => {
        const name = addToFavoritesBtn.getAttribute('data-name');
        console.log(`Натиснуто сердечко для товару: ${name}`);
        addToFavorites(name);
    });

    return productElement;
}

function loadMoreProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const totalProducts = products.length;
    const remainingProducts = totalProducts - productIndex;

    if (remainingProducts <= 0) {
        // Всі товари вже завантажені, припиняємо
        return;
    }

    const productsToLoad = Math.min(PRODUCTS_PER_ROW, remainingProducts);
    for (let i = 0; i < productsToLoad; i++) {
        if (productIndex >= totalProducts) break; // Додаткова перевірка
        const product = products[productIndex];
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
        loadedProducts.push(product);
        productIndex++;
    }

    // Додаємо клас visible для анімації
    const newProducts = productGrid.querySelectorAll('.product:not(.visible)');
    setTimeout(() => {
        newProducts.forEach(product => product.classList.add('visible'));
    }, 50);
}

// Функція для відстеження видимості товарів
function observeProducts() {
    const products = document.querySelectorAll('.product');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.5 });

    products.forEach(product => {
        observer.observe(product);
    });
}

// Функція debounce для обмеження частоти викликів
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обробник прокручування
const handleScroll = debounce(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    console.log(`Scroll: ${scrollPosition}, Page height: ${pageHeight}`);
    if (scrollPosition >= pageHeight - 300) {
        loadMoreProducts(products);
    }
}, 200);

// Збереження кошика в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Збережено кошик в localStorage:', cart);
}

// Збереження улюблених в localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Додавання до кошика
function addToCart(item, price) {
    cart.push({ item, price });
    saveCart();
    alert(`${item} додано до кошика!`);
    updateCart();
}

// Додавання до улюблених
function addToFavorites(item) {
    console.log('Поточний список улюблених:', favorites);
    if (!favorites.includes(item)) {
        favorites.push(item);
        saveFavorites();
        console.log('Новий список улюблених:', favorites);
        if (typeof window.updateFavorites === 'function') {
            window.updateFavorites();
            console.log('updateFavorites викликано');
        } else {
            console.log('Функція updateFavorites недоступна, оновлення не виконано');
        }
        alert(`${item} додано до улюблених!`);
    } else {
        console.log(`${item} вже є в улюблених`);
    }
}

// Оновлення кошика (викликається на cart.html)
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    if (cartItems && totalPrice) {
        cartItems.innerHTML = cart.map(item => `<li>${item.item} - ${item.price} грн</li>`).join('');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPrice.textContent = `Загальна сума: ${total} грн`;
    } else {
        console.log('Елементи кошика не знайдені (можливо, не на сторінці кошика)');
    }
}

// Оформлення замовлення
function checkout() {
    const checkoutSection = document.getElementById('checkout');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutSection && checkoutItems && checkoutTotal) {
        checkoutSection.style.display = 'block';
        checkoutItems.innerHTML = cart.map(item => `<li>${item.item} - ${item.price} грн</li>`).join('');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        checkoutTotal.textContent = `Загальна сума: ${total} грн`;
    }
}

// Скасування оформлення замовлення
function cancelCheckout() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.style.display = 'none';
    }
}

// Ініціація збереження замовлення
function initiateSaveOrder() {
    const modal = document.getElementById('download-modal');
    modal.style.display = 'flex';
}

// Генерація тексту чеку
function generateReceipt() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const date = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });
    let receipt = `Зоомагазин "Лапки"\nЧек замовлення\n\nДата: ${date}\n\nТовари:\n`;
    cart.forEach(item => {
        receipt += `${item.item} - ${item.price} грн\n`;
    });
    receipt += `\nЗагальна сума: ${total} грн\n\nДякуємо за покупку!`;
    return receipt;
}

// Завантаження чеку як файлу
function downloadReceipt() {
    const receiptText = generateReceipt();
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Підтвердження замовлення та завантаження чеку
function confirmOrder(download = false) {
    if (download) {
        downloadReceipt();
    }
    alert('Замовлення оформлено!');
    cart = [];
    saveCart();
    updateCart();
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('download-modal').style.display = 'none';
}

// Відображення фото користувача на головній сторінці
function displayUserPhoto() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const userPhoto = document.getElementById('user-photo');
        if (userPhoto) {
            userPhoto.src = user.photo;
        }
    }
}

// Фільтрація товарів за категорією
function filterProducts(category) {
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.innerHTML = '';
        let filteredProducts = products;
        if (category !== 'all') {
            filteredProducts = products.filter(p => p.category === category);
        }
        productIndex = 0;
        loadMoreProducts(filteredProducts);
    }
}

// Ініціалізація залежно від сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Відображення фото користувача на головній сторінці
    if (document.getElementById('user-profile') && window.location.pathname.includes('main.html')) {
        displayUserPhoto();
    }

    // Завантаження товарів на головній сторінці
    const productGrid = document.querySelector('.product-grid');
    if (productGrid && products.length > 0) {
        console.log('Завантажено продуктів:', products.length);
        loadMoreProducts(products);

        // Обробник для фільтрації за категоріями
        const categoryLinks = document.querySelectorAll('.dropdown a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                filterProducts(category);
            });
        });

        observeProducts();
    }

    // Пошук на головній сторінці
    const searchInput = document.getElementById('search');
    if (searchInput && !searchInput.disabled) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const name = product.querySelector('h2').textContent.toLowerCase();
                product.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
    }

    // Оновлення кошика на сторінці кошика
    if (document.getElementById('cart-items')) {
        updateCart();
    }

    // Обробники для модального вікна завантаження чеку
    const downloadYes = document.getElementById('download-yes');
    const downloadNo = document.getElementById('download-no');
    if (downloadYes && downloadNo) {
        downloadYes.addEventListener('click', () => confirmOrder(true));
        downloadNo.addEventListener('click', () => confirmOrder(false));
    }

    // Прокручування на головній сторінці
    if (productGrid) {
        window.addEventListener('scroll', handleScroll);
    }
});