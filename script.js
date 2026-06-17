// ==========================================
// РАБОЧИЕ КНОПКИ И ФУНКЦИОНАЛ
// ==========================================

// --- 1. ПЛАВНАЯ ПРОКРУТКА ---
document.querySelectorAll('.nav-link, .hero-btn').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// --- 2. МОДАЛЬНЫЕ ОКНА ---
const cartBtn = document.getElementById('cartBtn');
const searchBtn = document.getElementById('searchBtn');
const profileBtn = document.getElementById('profileBtn');
const cartModal = document.getElementById('cartModal');
const searchModal = document.getElementById('searchModal');
const profileModal = document.getElementById('profileModal');
const closeButtons = document.querySelectorAll('.close-modal');

// Открытие
cartBtn.addEventListener('click', () => openModal(cartModal));
searchBtn.addEventListener('click', () => {
    openModal(searchModal);
    document.getElementById('searchInput').focus();
});
profileBtn.addEventListener('click', () => openModal(profileModal));

// Закрытие крестиком
closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').classList.remove('active');
    });
});

// Закрытие по клику вне окна
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

function openModal(modal) {
    modal.classList.add('active');
}

// --- 3. КОРЗИНА ---
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Добавление в корзину
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const card = this.closest('.product-card');
        const name = card.querySelector('h4').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/\s/g, '').replace('₽', ''));
        
        cart.push({ name, price, id: Date.now() });
        updateCart();
        showNotification(`"${name}" добавлен в корзину`);
        
        // Анимация кнопки
        this.textContent = '✓ Добавлено';
        this.style.background = '#27ae60';
        setTimeout(() => {
            this.textContent = 'В корзину';
            this.style.background = '';
        }, 1500);
    });
});

// Обновление корзины
function updateCart() {
    cartCount.textContent = cart.length;
    
    // Анимация счётчика
    cartCount.style.animation = 'none';
    setTimeout(() => cartCount.style.animation = 'bounce 0.3s', 10);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        cartTotal.textContent = '';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    checkoutBtn.style.display = 'block';
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.price.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button class="remove-item" data-id="${item.id}" title="Удалить">×</button>
            </div>
        `;
        total += item.price;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `Итого: ${total.toLocaleString('ru-RU')} ₽`;
    
    // Удаление товаров
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cart.find(i => i.id === id);
            cart = cart.filter(item => item.id !== id);
            updateCart();
            showNotification(`"${item.name}" удалён из корзины`);
        });
    });
}

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showNotification(`✓ Заказ на ${total.toLocaleString('ru-RU')} ₽ оформлен!`);
    
    setTimeout(() => {
        cart = [];
        updateCart();
        cartModal.classList.remove('active');
    }, 2000);
});

// --- 4. ПОИСК ---
const searchSubmit = document.getElementById('searchSubmit');
const searchInput = document.getElementById('searchInput');

searchSubmit.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        showNotification(`🔍 Поиск: "${query}"`);
        setTimeout(() => {
            searchModal.classList.remove('active');
            searchInput.value = '';
        }, 1000);
    } else {
        showNotification('⚠ Введите запрос для поиска');
    }
});

// Поиск по Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchSubmit.click();
});

// --- 5. ФОРМА ПОДПИСКИ ---
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    // Валидация
    if (!email.includes('@') || !email.includes('.')) {
        formMessage.style.color = '#e74c3c';
        formMessage.textContent = '⚠ Введите корректный email';
        return;
    }
    
    formMessage.style.color = '#27ae60';
    formMessage.textContent = `✓ Спасибо! ${email} добавлен в рассылку`;
    emailInput.value = '';
    showNotification('✓ Вы успешно подписались!');
    
    setTimeout(() => {
        formMessage.textContent = '';
    }, 5000);
});

// --- 6. УВЕДОМЛЕНИЯ ---
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// --- 7. ЛОГОТИП ---
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 8. ИНИЦИАЛИЗАЦИЯ ---
updateCart();

// --- 9. АНИМАЦИЯ ПРИ СКРОЛЛЕ ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});