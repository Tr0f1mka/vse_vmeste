// Скрипты для главной страницы
// Здесь происходит подтяжка данных с бекенда(пока что для тестов это сделано с помощью json формата ниже)
// [
//     {
//         "id": 1,
//         "title": "Имя фонда",
//         "body": "Описание фонда",
//         "url": "URL картинки фонда(если её нет - ничего не выводится"
//     },
//     ...
// ]

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

    // URL бэкенда
    const BACKEND_URL = 'https://jsonplaceholder.typicode.com/photos';
    
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
        alert('Форма для оставления заявки о помощи будет открыта здесь.');
    });
    
    // Обработка кнопки добавления фонда
    addFundButton.addEventListener('click', function() {
        alert('Форма для добавления нового фонда/заявки будет открыта здесь.');
    });
    
    // Функция для отображения ошибки
    function showError(message = 'Не удалось загрузить данные. Проверьте подключение к серверу.') {
        errorMessage.querySelector('p').textContent = message;
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
        loadingSpinner.style.display = 'none';
        // fundsGrid.innerHTML = '<div class="empty-state"><p>Не удалось загрузить данные о фондах.</p></div>';
    }
    
    // Функция для отображения карточек фондов
    function showFunds(funds) {
        errorMessage.classList.remove('show');
        successMessage.classList.add('show');
        loadingSpinner.style.display = 'none';
        fundsCount.textContent = funds.length;
        
        // Очищаем сетку
        fundsGrid.innerHTML = '';
        
        // Добавляем карточки фондов
        funds.forEach(fund => {
            const fundCard = document.createElement('div');
            fundCard.className = 'fund-card';
            
            fundCard.innerHTML = `
                <div class="fund-image" style="background: ${getRandomGradient()}">
                    <img src="${fund.image}" onerror='this.style.display = "none"'/>
                </div>
                <div class="fund-content">
                    <h3 class="fund-title">${fund.name}</h3>
                    <p class="fund-description">${fund.description}</p>
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
            // fundsGrid.innerHTML = '<div class="empty-state"><p>Загрузка данных о фондах...</p></div>';
            
            // Имитация запроса к реальному API
            const response = await fetch(BACKEND_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Обработка данных с бэкенда

            // Преобразуем данные из API в формат нашего приложения
            const funds = transformBackendData(data);
                
            if (funds.length > 0) {
                showFunds(funds);
            } else {
                showError('На сервере нет данных о фондах.');
            }

            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showError(`Ошибка соединения с сервером: ${error.message}`);
        }
    }
    
    // Функция для преобразования данных из бэкенда
    function transformBackendData(apiData) {
        // В реальном приложении здесь будет логика преобразования данных
        return apiData.map((item, index) => ({
            id: item.id || index + 1,
            name: `Фонд "${item.title || `Благотворительный фонд ${index + 1}`}"`,
            description: item.body || 'Описание фонда будет загружено с сервера.',
            image: item.azaza,
        }));
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