// Скрипты для главной страницы
document.addEventListener('DOMContentLoaded', function() {
    // Элементы страницы
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const fundsGrid = document.getElementById('fundsGrid');
    const fundsCount = document.getElementById('fundsCount');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const pageSections = document.querySelectorAll('.page-section');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const requestHelpBtn = document.querySelector('.request-help-btn');
    const addFundButton = document.querySelector('.add-fund-btn');

    // URL бэкенда Django
    const BACKEND_URL = 'http://localhost:8000/api';
    
    // Переменная для отслеживания загруженных данных
    let fundsLoaded = false;
    
    // Обработка навигационных кнопок
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Убираем класс active у всех кнопок и секций
            navLinks.forEach(l => l.classList.remove('active'));
            pageSections.forEach(section => section.classList.remove('active'));
            
            // Добавляем класс active к нажатой кнопке
            this.classList.add('active');
            
            // Показываем соответствующую секцию
            const pageId = this.dataset.page;
            document.getElementById(`${pageId}-section`).classList.add('active');
            
            // Если перешли на страницу фондов и данные еще не загружены, загружаем данные
            if (pageId === 'funds' && !fundsLoaded) {
                loadFundsFromBackend();
                fundsLoaded = true;
            }
        });
    });
    
    // Обработка кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // В реальном приложении здесь будет фильтрация заявок на карте
        });
    });
    
    // Обработка кнопки "Оставить заявку о помощи"
    requestHelpBtn.addEventListener('click', function() {
        showHelpRequestForm();
    });
    
    // Обработка кнопки добавления фонда
    addFundButton.addEventListener('click', function() {
        showAddFundForm();
    });
    
    // Функция для отображения ошибки
    function showError(message = 'Не удалось загрузить данные. Проверьте подключение к серверу.') {
        errorMessage.querySelector('p').textContent = message;
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
        loadingSpinner.style.display = 'none';
    }
    
    // Функция для отображения успешного сообщения
    function showSuccess(message) {
        successMessage.querySelector('p').textContent = message;
        successMessage.classList.add('show');
        errorMessage.classList.remove('show');
        loadingSpinner.style.display = 'none';
    }
    
    // Функция для отображения карточек фондов
    function showFunds(funds) {
        errorMessage.classList.remove('show');
        successMessage.classList.add('show');
        loadingSpinner.style.display = 'none';
        fundsCount.textContent = funds.length;
        
        // Очищаем сетку
        fundsGrid.innerHTML = '';
        
        if (funds.length === 0) {
            fundsGrid.innerHTML = `
                <div class="empty-state">
                    <p>Пока нет благотворительных фондов.</p>
                    <button class="add-fund-btn" style="margin-top: 1rem;">Добавить первый фонд</button>
                </div>
            `;
            return;
        }
        
        // Добавляем карточки фондов
        funds.forEach(fund => {
            const fundCard = document.createElement('div');
            fundCard.className = 'fund-card';
            
            fundCard.innerHTML = `
                <div class="fund-image" style="background: ${getRandomGradient()}">
                    ${fund.image_url ? `<img src="${fund.image_url}" alt="${fund.name}" />` : ''}
                </div>
                <div class="fund-content">
                    <h3 class="fund-title">${fund.name}</h3>
                    <p class="fund-description">${fund.description}</p>
                    <div class="fund-contacts">
                        ${fund.website ? `<a href="${fund.website}" target="_blank" class="website-link">🌐 Сайт</a>` : ''}
                        ${fund.contact_email ? `<a href="mailto:${fund.contact_email}" class="email-link">✉️ Email</a>` : ''}
                    </div>
                    <button class="donate-btn" data-fund-id="${fund.id}">Поддержать</button>
                </div>
            `;
            
            fundsGrid.appendChild(fundCard);
        });
        
        // Добавляем обработчики для кнопок пожертвований
        const donateButtons = document.querySelectorAll('.donate-btn');
        donateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const fundId = this.getAttribute('data-fund-id');
                alert(`Спасибо за желание помочь фонду ID: ${fundId}! В реальном приложении здесь будет форма для пожертвования.`);
            });
        });
    }
    
    // Функция для загрузки данных с бэкенда
    async function loadFundsFromBackend() {
        try {
            // Показываем индикатор загрузки
            loadingSpinner.style.display = 'block';
            errorMessage.classList.remove('show');
            successMessage.classList.remove('show');
            
            const response = await fetch(`${BACKEND_URL}/funds/`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const funds = await response.json();
            
            if (funds.length > 0) {
                showFunds(funds);
            } else {
                showSuccess('На сервере пока нет данных о фондах. Вы можете добавить первый фонд!');
            }
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showError(`Ошибка соединения с сервером: ${error.message}. Убедитесь, что Django сервер запущен на localhost:8000`);
        }
    }
    
    // Функция для показа формы добавления заявки
    function showHelpRequestForm() {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>Оставить заявку о помощи</h3>
                    <form id="helpRequestForm">
                        <input type="text" name="title" placeholder="Заголовок заявки" required>
                        <textarea name="description" placeholder="Описание потребности" required></textarea>
                        <select name="category" required>
                            <option value="">Выберите категорию</option>
                            <option value="food">Еда</option>
                            <option value="clothes">Одежда</option>
                            <option value="medicine">Лекарства</option>
                            <option value="other">Другое</option>
                        </select>
                        <input type="text" name="location" placeholder="Ваше местоположение" required>
                        <input type="text" name="contact_info" placeholder="Контактная информация" required>
                        <label>
                            <input type="checkbox" name="is_urgent"> Срочная заявка
                        </label>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn">Отмена</button>
                            <button type="submit">Отправить заявку</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        const modal = document.querySelector('.modal-overlay');
        const form = document.getElementById('helpRequestForm');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        form.addEventListener('submit', submitHelpRequest);
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // Функция для отправки заявки о помощи
    async function submitHelpRequest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.is_urgent = data.is_urgent === 'on';
        
        try {
            const response = await fetch(`${BACKEND_URL}/help-requests/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('Заявка успешно отправлена!');
                document.querySelector('.modal-overlay').remove();
            } else {
                throw new Error('Ошибка при отправке заявки');
            }
        } catch (error) {
            alert('Ошибка при отправке заявки: ' + error.message);
        }
    }
    
    // Функция для показа формы добавления фонда
    function showAddFundForm() {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>Добавить благотворительный фонд</h3>
                    <form id="addFundForm">
                        <input type="text" name="name" placeholder="Название фонда" required>
                        <textarea name="description" placeholder="Описание фонда" required></textarea>
                        <input type="url" name="website" placeholder="Веб-сайт (необязательно)">
                        <input type="email" name="contact_email" placeholder="Email для связи (необязательно)">
                        <div class="form-actions">
                            <button type="button" class="cancel-btn">Отмена</button>
                            <button type="submit">Добавить фонд</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        const modal = document.querySelector('.modal-overlay');
        const form = document.getElementById('addFundForm');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        form.addEventListener('submit', submitAddFund);
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // Функция для отправки формы добавления фонда
    async function submitAddFund(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(`${BACKEND_URL}/funds/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('Фонд успешно добавлен!');
                document.querySelector('.modal-overlay').remove();
                // Перезагружаем список фондов
                loadFundsFromBackend();
            } else {
                throw new Error('Ошибка при добавлении фонда');
            }
        } catch (error) {
            alert('Ошибка при добавлении фонда: ' + error.message);
        }
    }
    
    // Автоматическая загрузка данных при загрузке страницы (если активна вкладка фондов)
    if (document.getElementById('funds-section').classList.contains('active')) {
        loadFundsFromBackend();
        fundsLoaded = true;
    }

    // Вспомогательная функция для генерации случайного градиента
    function getRandomGradient() {
        const colors = [
            'linear-gradient(135deg, #3498db 0%, #8e44ad 100%)',
            'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)',
            'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)',
            'linear-gradient(135deg, #9b59b6 0%, #34495e 100%)',
            'linear-gradient(135deg, #1abc9c 0%, #3498db 100%)',
            'linear-gradient(135deg, #e67e22 0%, #e74c3c 100%)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});