/* ==========================================
   JAVASCRIPT ДЛЯ САЙТА STUDENTREG
   Онлайн-система регистрации студентов
   ========================================== */

// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
});


/* ---------- Мобильное меню ---------- */

/**
 * Инициализация мобильного меню
 * Обрабатывает открытие/закрытие меню на мобильных устройствах
 */
function initMobileMenu() {
    // Находим кнопку меню и список ссылок
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Проверяем, что элементы существуют
    if (!menuButton || !navLinks) return;
    
    // Обработчик клика по кнопке меню
    menuButton.addEventListener('click', function() {
        // Переключаем класс active для кнопки (анимация гамбургера)
        menuButton.classList.toggle('active');
        // Переключаем класс active для меню (показываем/скрываем)
        navLinks.classList.toggle('active');
    });
    
    // Закрываем меню при клике на ссылку
    const links = navLinks.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Закрываем меню при клике вне его области
    document.addEventListener('click', function(event) {
        // Проверяем, был ли клик вне меню и кнопки
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnButton = menuButton.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && navLinks.classList.contains('active')) {
            menuButton.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}


/* ---------- Плавная прокрутка ---------- */

/**
 * Инициализация плавной прокрутки для якорных ссылок
 */
function initSmoothScroll() {
    // Находим все ссылки, начинающиеся с #
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Получаем id целевого элемента
            const targetId = this.getAttribute('href');
            
            // Пропускаем, если это просто #
            if (targetId === '#') return;
            
            // Находим целевой элемент
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Предотвращаем стандартное поведение
                event.preventDefault();
                
                // Вычисляем позицию с учетом фиксированной шапки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Плавно прокручиваем к элементу
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ---------- Анимация появления при скролле ---------- */

/**
 * Инициализация анимации появления элементов при прокрутке
 * Использует Intersection Observer API для отслеживания видимости элементов
 */
function initScrollAnimations() {
    // Находим все элементы с классом fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        // Настройки наблюдателя
        const observerOptions = {
            root: null,           // Наблюдаем относительно viewport
            rootMargin: '0px',    // Без отступов
            threshold: 0.1        // Срабатывает когда 10% элемента видно
        };
        
        // Создаем наблюдателя
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                // Если элемент виден
                if (entry.isIntersecting) {
                    // Добавляем небольшую задержку для каскадного эффекта
                    const delay = Array.from(fadeElements).indexOf(entry.target) * 100;
                    
                    setTimeout(function() {
                        entry.target.classList.add('visible');
                    }, Math.min(delay, 300)); // Максимальная задержка 300мс
                    
                    // Прекращаем наблюдение за этим элементом
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Начинаем наблюдение за каждым элементом
        fadeElements.forEach(function(element) {
            observer.observe(element);
        });
    } else {
        // Fallback для старых браузеров - просто показываем все элементы
        fadeElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }
}


/* ---------- Валидация формы контактов ---------- */

/**
 * Инициализация валидации формы обратной связи
 */
function initContactForm() {
    // Находим форму
    const form = document.getElementById('contactForm');
    
    // Проверяем, существует ли форма на странице
    if (!form) return;
    
    // Находим элементы формы
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(event) {
        // Предотвращаем стандартную отправку
        event.preventDefault();
        
        // Сбрасываем предыдущие ошибки
        clearErrors();
        
        // Флаг валидности формы
        let isValid = true;
        
        // Валидация имени
        if (!validateName(nameInput.value)) {
            showError('name', 'Пожалуйста, введите ваше имя (минимум 2 символа)');
            isValid = false;
        }
        
        // Валидация email
        if (!validateEmail(emailInput.value)) {
            showError('email', 'Пожалуйста, введите корректный email адрес');
            isValid = false;
        }
        
        // Валидация сообщения
        if (!validateMessage(messageInput.value)) {
            showError('message', 'Пожалуйста, введите сообщение (минимум 10 символов)');
            isValid = false;
        }
        
        // Если форма валидна
        if (isValid) {
            // Симулируем отправку формы
            submitForm(form, successMessage);
        }
    });
    
    // Валидация в реальном времени при вводе
    nameInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearError('name');
            if (!validateName(this.value)) {
                showError('name', 'Минимум 2 символа');
            }
        }
    });
    
    emailInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearError('email');
            if (!validateEmail(this.value)) {
                showError('email', 'Некорректный email');
            }
        }
    });
    
    messageInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearError('message');
            if (!validateMessage(this.value)) {
                showError('message', 'Минимум 10 символов');
            }
        }
    });
}

/**
 * Проверка валидности имени
 * @param {string} name - Введенное имя
 * @returns {boolean} - true если имя валидно
 */
function validateName(name) {
    // Имя должно содержать минимум 2 символа (без пробелов по краям)
    return name.trim().length >= 2;
}

/**
 * Проверка валидности email
 * @param {string} email - Введенный email
 * @returns {boolean} - true если email валиден
 */
function validateEmail(email) {
    // Регулярное выражение для проверки email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Проверка валидности сообщения
 * @param {string} message - Введенное сообщение
 * @returns {boolean} - true если сообщение валидно
 */
function validateMessage(message) {
    // Сообщение должно содержать минимум 10 символов
    return message.trim().length >= 10;
}

/**
 * Показать сообщение об ошибке для поля
 * @param {string} fieldName - Имя поля (name, email, message)
 * @param {string} message - Текст ошибки
 */
function showError(fieldName, message) {
    // Находим поле и элемент для вывода ошибки
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (input && errorElement) {
        // Добавляем класс ошибки к полю
        input.classList.add('error');
        // Выводим текст ошибки
        errorElement.textContent = message;
    }
}

/**
 * Очистить ошибку для конкретного поля
 * @param {string} fieldName - Имя поля
 */
function clearError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (input && errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }
}

/**
 * Очистить все ошибки формы
 */
function clearErrors() {
    // Убираем класс error со всех полей
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(function(input) {
        input.classList.remove('error');
    });
    
    // Очищаем все сообщения об ошибках
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(element) {
        element.textContent = '';
    });
}

/**
 * Симуляция отправки формы
 * @param {HTMLFormElement} form - Форма
 * @param {HTMLElement} successMessage - Элемент с сообщением об успехе
 */
function submitForm(form, successMessage) {
    // Получаем кнопку отправки
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Показываем состояние загрузки
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    // Симулируем задержку отправки (в реальном проекте здесь будет AJAX запрос)
    setTimeout(function() {
        // Скрываем форму
        form.style.display = 'none';
        
        // Показываем сообщение об успехе
        successMessage.style.display = 'block';
        
        // Добавляем анимацию появления
        successMessage.classList.add('fade-in', 'visible');
        
        // Выводим данные в консоль (для демонстрации)
        console.log('Форма отправлена!');
        console.log('Имя:', document.getElementById('name').value);
        console.log('Email:', document.getElementById('email').value);
        console.log('Сообщение:', document.getElementById('message').value);
        
    }, 1500); // Задержка 1.5 секунды
}


/* ---------- Дополнительные функции ---------- */

/**
 * Функция для изменения стилей шапки при прокрутке
 * Добавляет тень и уменьшает прозрачность при скролле
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});
