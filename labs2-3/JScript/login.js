// Реєстрація користувача
function registerUser() {
    const profilePhoto = document.getElementById('profile-photo');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const fullName = document.getElementById('full-name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();

    // Перевірка заповнення всіх полів
    if (!profilePhoto.files[0] || !username || !password || !fullName || !address || !phone || !email || !cardNumber) {
        alert('Будь ласка, заповніть усі поля!');
        return;
    }

    // Перевірка формату телефону
    if (!phone.match(/\+?[0-9]{10,15}/)) {
        alert('Невірний формат телефону!');
        return;
    }

    // Перевірка формату номера картки
    if (!cardNumber.match(/[0-9]{16}/)) {
        alert('Номер картки має містити рівно 16 цифр!');
        return;
    }

    // Зчитування фото як Data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;

        // Збереження користувача
        const user = {
            photo: photoData,
            username: username,
            password: password,
            fullName: fullName,
            address: address,
            phone: phone,
            email: email,
            cardNumber: cardNumber
        };

        // Зберігаємо користувача в localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)) {
            alert('Користувач із таким логіном вже зареєстрований!');
            return;
        }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        // Зберігаємо поточного користувача
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert('Реєстрація успішна!');
        window.location.href = '../main.html';
    };
    reader.readAsDataURL(profilePhoto.files[0]);
}

// Вхід користувача
function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('password').value.trim(); // Додано .trim()

    if (!username || !password) {
        alert('Будь ласка, заповніть усі поля!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Вхід успішний!');
        window.location.href = '../main.html';
    } else {
        alert('Невірний логін або пароль!');
    }
}

// Вихід користувача
function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('Ви вийшли з акаунту!');
    window.location.href = 'login.html';
}

// Перевірка авторизації
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isAuthPage = window.location.pathname.includes('register.html') || window.location.pathname.includes('login.html');
    if (!currentUser && !isAuthPage) {
        window.location.href = 'login.html';
    }
}

// Ініціалізація залежно від сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Перевірка авторизації
    checkAuth();

    // Попередній перегляд фото на сторінці реєстрації
    const profilePhotoInput = document.getElementById('profile-photo');
    const photoPreview = document.getElementById('photo-preview');
    if (profilePhotoInput && photoPreview) {
        profilePhotoInput.addEventListener('change', () => {
            const file = profilePhotoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Обробка входу користувача
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginUser();
        });
    }

    // Обробка входу адміністратора
    const adminLoginBtn = document.getElementById('admin-login');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            localStorage.setItem('isAdmin', 'true');
            window.location.href = '../admin.html';
        });
    }
});