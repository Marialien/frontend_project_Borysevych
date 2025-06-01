// Відображення профілю користувача
function displayUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const userPhoto = document.getElementById('user-photo');
        const username = document.getElementById('username');
        const fullName = document.getElementById('full-name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const address = document.getElementById('address');

        if (userPhoto && username && fullName && phone && email && address) {
            userPhoto.src = user.photo;
            userPhoto.classList.add('profile-photo');
            username.textContent = user.username || 'Невідомо';
            fullName.textContent = user.fullName || 'Невідомо';
            phone.textContent = user.phone || 'Невідомо';
            email.textContent = user.email || 'Невідомо';
            address.textContent = user.address || 'Невідомо';
        } else {
            console.log('Не вдалося знайти всі елементи для відображення профілю');
        }
    } else {
        console.log('Користувач не авторизований');
        window.location.href = 'login.html';
    }
}

// Ініціалізація сторінки профілю
document.addEventListener('DOMContentLoaded', () => {
    displayUserProfile();
});

JSON.parse(localStorage.getItem("users"))