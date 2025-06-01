// Зчитуємо улюблені з localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
console.log('Завантажено улюблені з localStorage:', favorites);

// Зчитуємо кошик з localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Завантажено кошик з localStorage:', cart);

// Статичний масив товарів (з product.json)
let products = [
    { name: "Миска для собак", price: 100, image: "images/product4.jpg", alt: "Миска для собак з нержавіючої сталі" },
    { name: "Корм для птахів", price: 80, image: "images/product5.jpg", alt: "Суміш зерен для птахів" },
    { name: "Нашийник для котів", price: 200, image: "images/product6.jpg", alt: "Зручний нашийник для котів з дзвіночком" },
    { name: "Іграшка для котів", price: 120, image: "images/product7.jpg", alt: "М’яка іграшка-мишка для котів" },
    { name: "Лежак для собак", price: 500, image: "images/product8.jpg", alt: "Ортопедичний лежак для собак" },
    { name: "Будка для котів", price: 300, image: "images/product9.jpg", alt: "Затишна будка для котів з м’яким дном" },
    { name: "Годівниця для птахів", price: 150, image: "images/product10.jpg", alt: "Прозора годівниця для птахів на підвіконня" },
    { name: "Шампуні для собак", price: 250, image: "images/product11.jpg", alt: "Природний шампунь для собак" },
    { name: "Клітка для хом’яків", price: 400, image: "images/product12.jpg", alt: "Простора клітка для хом’яків з колесом" },
    { name: "Ласощі для котів", price: 90, image: "images/product13.jpg", alt: "Натуральні ласощі для котів" },
    { name: "Іграшка для собак", price: 150, image: "images/product14.jpg", alt: "М’ячик для собак" },
    { name: "Клітка для птахів", price: 300, image: "images/product15.jpg", alt: "Простора клітка для птахів" },
    { name: "Корм для котів", price: 120, image: "images/product16.jpg", alt: "Сухий корм для котів" }
];

// Функція для створення картки товару в улюблених
function createFavoriteProductCard(product) {
    const productElement = document.createElement('article');
    productElement.classList.add('product');
    productElement.setAttribute('data-name', product.name);
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.alt}">
        <h2>${product.name}</h2>
        <p>Ціна: ${product.price} грн</p>
        <div class="product-actions">
            <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Додати в кошик</button>
            <button onclick="initiateRemove('${product.name}')" class="remove-button" aria-label="Видалити з улюблених">🗑️</button>
        </div>
    `;
    console.log(`Створено картку для товару: ${product.name}`);

    // Додаємо обробник події для кнопки "Додати в кошик"
    const addToCartBtn = productElement.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const name = addToCartBtn.getAttribute('data-name');
        const price = parseInt(addToCartBtn.getAttribute('data-price'));
        addToCart(name, price);
    });

    return productElement;
}

// Збереження кошика в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Збережено кошик в localStorage:', cart);
}

// Збереження улюблених в localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Збережено улюблені в localStorage:', favorites);
}

// Додавання до кошика
function addToCart(item, price) {
    cart.push({ item, price });
    saveCart();
    alert(`${item} додано до кошика!`);
    // Оновлюємо кошик (викликаємо функцію updateCart, якщо вона доступна)
    if (typeof window.updateCart === 'function') {
        window.updateCart();
    } else {
        console.log('Функція updateCart недоступна, оновлення не виконано');
    }
}

// Ініціація видалення з підтвердженням
let itemToRemove = null;
function initiateRemove(item) {
    itemToRemove = item;
    const modal = document.getElementById('confirm-modal');
    modal.style.display = 'flex';
}

// Видалення з улюблених
function removeFromFavorites(item) {
    const productElement = document.querySelector(`.product[data-name="${item}"]`);
    if (productElement) {
        productElement.classList.add('fade-out');
        setTimeout(() => {
            favorites = favorites.filter(fav => fav !== item);
            saveFavorites();
            alert(`${item} видалено з улюблених!`);
            updateFavorites();
        }, 300);
    }
}

// Оновлення улюблених (викликається на favorites.html)
function updateFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        console.log('Оновлюємо список улюблених, поточний список:', favorites);
        favoritesList.innerHTML = '';
        let foundItems = 0;
        favorites.forEach(item => {
            const product = products.find(p => p.name === item);
            if (product) {
                foundItems++;
                console.log(`Знайдено товар для відображення: ${item}`);
                const productCard = createFavoriteProductCard(product);
                favoritesList.appendChild(productCard);
                console.log(`Додано картку до DOM для товару: ${item}`);
            } else {
                console.log(`Товар не знайдено в масиві products: ${item}`);
            }
        });
        if (foundItems === 0) {
            console.log('Не знайдено жодного товару для відображення');
            favoritesList.innerHTML = '<p>У вас немає улюблених товарів.</p>';
        }
        console.log('Кількість елементів у favorites-list:', favoritesList.children.length);
    } else {
        console.log('Елементи улюблених не знайдені (можливо, не на сторінці улюблених)');
    }
}

// Ініціалізація сторінки улюблених
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('favorites-list')) {
        updateFavorites();

        // Обробники для модального вікна
        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');
        const modal = document.getElementById('confirm-modal');

        confirmYes.addEventListener('click', () => {
            if (itemToRemove) {
                removeFromFavorites(itemToRemove);
                itemToRemove = null;
            }
            modal.style.display = 'none';
        });

        confirmNo.addEventListener('click', () => {
            itemToRemove = null;
            modal.style.display = 'none';
        });
    }
});

// Експорт функцій для доступу з інших скриптів
window.updateFavorites = updateFavorites;
window.removeFromFavorites = removeFromFavorites;