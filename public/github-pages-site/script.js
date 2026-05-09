/* ============================================
   SCRIPT.JS - JavaScript функционал сайта StudentReg
   
   Содержание:
   1. Мобильное меню (бургер)
   2. Анимация счетчиков статистики
   3. Валидация формы обратной связи
   4. FAQ аккордеон
   5. Анимации при скролле
   6. Плавный скролл к якорям
   ============================================ */

// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       1. МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
       
       Функционал:
       - Открытие/закрытие меню по клику на бургер
       - Закрытие меню при клике на ссылку
       - Закрытие меню при клике вне меню
       ============================================ */
    
    // Получаем элементы бургер-кнопки и навигационного списка
    const burger = document.getElementById('burger');
    const navList = document.getElementById('navList');
    
    // Проверяем, существуют ли элементы на странице
    if (burger && navList) {
        // Обработчик клика по бургер-кнопке
        burger.addEventListener('click', function() {
            // Переключаем класс 'active' для анимации бургера
            burger.classList.toggle('active');
            // Переключаем класс 'active' для показа/скрытия меню
            navList.classList.toggle('active');
        });
        
        // Закрытие меню при клике на навигационную ссылку
        const navLinks = navList.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            // Проверяем, был ли клик вне меню и бургера
            const isClickInsideNav = navList.contains(event.target);
            const isClickOnBurger = burger.contains(event.target);
            
            // Если клик был снаружи и меню открыто - закрываем
            if (!isClickInsideNav && !isClickOnBurger && navList.classList.contains('active')) {
                burger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    }
    
    /* ============================================
       2. АНИМАЦИЯ СЧЕТЧИКОВ СТАТИСТИКИ
       
       Функционал:
       - Плавное увеличение чисел от 0 до целевого значения
       - Запуск анимации при появлении в зоне видимости
       - Анимация запускается только один раз
       ============================================ */
    
    // Получаем все элементы с числами статистики
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Функция анимации числа
    function animateNumber(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        
        function updateNumber() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString('ru-RU');
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target.toLocaleString('ru-RU');
            }
        }
        
        updateNumber();
    }
    
    // Флаг для отслеживания, была ли уже запущена анимация
    let statsAnimated = false;
    
    // Функция проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Функция запуска анимации счетчиков
    function startStatsAnimation() {
        // Если анимация уже была - выходим
        if (statsAnimated) return;
        
        // Проверяем, есть ли счетчики на странице
        if (statNumbers.length === 0) return;
        
        // Проверяем видимость первого счетчика
        const statsSection = statNumbers[0].closest('.stats');
        if (statsSection && isElementInViewport(statsSection)) {
            statsAnimated = true;
            
            // Запускаем анимацию для каждого числа
            statNumbers.forEach(function(stat) {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target) {
                    animateNumber(stat, target, 2000); // 2 секунды на анимацию
                }
            });
        }
    }
    
    // Запускаем проверку при скролле и при загрузке
    window.addEventListener('scroll', startStatsAnimation);
    startStatsAnimation(); // Проверка при загрузке
    
    /* ============================================
       3. ВАЛИДАЦИЯ ФОРМЫ ОБРАТНОЙ СВЯЗИ
       
       Функционал:
       - Проверка заполнения обязательных полей
       - Валидация email адреса
       - Валидация телефона (если заполнен)
       - Показ сообщений об ошибках
       - Показ сообщения об успешной отправке
       ============================================ */
    
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Предотвращаем стандартную отправку формы
            event.preventDefault();
            
            // Сбрасываем предыдущие ошибки
            clearErrors();
            
            // Флаг валидности формы
            let isValid = true;
            
            // Получаем значения полей
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const agree = document.getElementById('agree');
            
            // Валидация имени
            if (!name.value.trim()) {
                showError(name, 'nameError', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'nameError', 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }
            
            // Валидация email
            if (!email.value.trim()) {
                showError(email, 'emailError', 'Пожалуйста, введите email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'emailError', 'Пожалуйста, введите корректный email');
                isValid = false;
            }
            
            // Валидация телефона (если заполнен)
            if (phone.value.trim() && !isValidPhone(phone.value)) {
                showError(phone, 'phoneError', 'Пожалуйста, введите корректный номер телефона');
                isValid = false;
            }
            
            // Валидация темы
            if (!subject.value) {
                showError(subject, 'subjectError', 'Пожалуйста, выберите тему обращения');
                isValid = false;
            }
            
            // Валидация сообщения
            if (!message.value.trim()) {
                showError(message, 'messageError', 'Пожалуйста, введите сообщение');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'messageError', 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            }
            
            // Валидация согласия
            if (!agree.checked) {
                showError(agree, 'agreeError', 'Необходимо дать согласие на обработку данных');
                isValid = false;
            }
            
            // Если форма валидна - показываем успех
            if (isValid) {
                // Скрываем форму
                contactForm.style.display = 'none';
                // Показываем сообщение об успехе
                formSuccess.classList.add('show');
                
                // В реальном проекте здесь была бы отправка данных на сервер
                // fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
            }
        });
        
        // Функция показа ошибки
        function showError(input, errorId, message) {
            input.classList.add('error');
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
        
        // Функция очистки ошибок
        function clearErrors() {
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(function(input) {
                input.classList.remove('error');
            });
            
            const errors = contactForm.querySelectorAll('.error-message');
            errors.forEach(function(error) {
                error.textContent = '';
            });
        }
        
        // Функция проверки email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Функция проверки телефона
        function isValidPhone(phone) {
            // Удаляем все символы кроме цифр
            const cleanPhone = phone.replace(/\D/g, '');
            // Проверяем, что цифр от 10 до 15
            return cleanPhone.length >= 10 && cleanPhone.length <= 15;
        }
        
        // Очистка ошибки при вводе
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(function(input) {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorId = this.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }
    
    /* ============================================
       4. FAQ АККОРДЕОН
       
       Функционал:
       - Открытие/закрытие ответов по клику
       - Только один ответ может быть открыт одновременно
       ============================================ */
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Проверяем, открыт ли текущий элемент
                const isActive = item.classList.contains('active');
                
                // Закрываем все элементы
                faqItems.forEach(function(faq) {
                    faq.classList.remove('active');
                });
                
                // Если элемент не был открыт - открываем его
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    /* ============================================
       5. АНИМАЦИИ ПРИ СКРОЛЛЕ
       
       Функционал:
       - Добавление класса 'visible' элементам с классом 'fade-in'
       - Срабатывает когда элемент появляется в зоне видимости
       ============================================ */
    
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeElements() {
        fadeElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Добавляем класс когда элемент виден на 80%
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }
    
    // Проверяем при скролле и при загрузке
    window.addEventListener('scroll', checkFadeElements);
    checkFadeElements();
    
    /* ============================================
       6. ПЛАВНЫЙ СКРОЛЛ К ЯКОРЯМ
       
       Функционал:
       - Плавная прокрутка к элементам при клике на якорные ссылки
       ============================================ */
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Пропускаем если это просто #
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                event.preventDefault();
                
                // Вычисляем позицию с учетом высоты шапки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Плавно прокручиваем к элементу
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ============================================
       ДОПОЛНИТЕЛЬНО: Изменение шапки при скролле
       
       Добавляет тень к шапке при прокрутке страницы
       ============================================ */
    
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
        });
    }
    
});

/* ============================================
   КОНЕЦ ФАЙЛА SCRIPT.JS
   ============================================ */
