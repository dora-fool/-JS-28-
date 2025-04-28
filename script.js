///// 1 Задание /////

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const contactDisplay = document.getElementById("contactDisplay");

  // Загрузка и отображение сохраненных данных при загрузке страницы
  displaySavedContact();

  // Обработчик отправки формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Собираем данные формы
    const contact = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    };

    // Сохраняем в LocalStorage как JSON
    localStorage.setItem("contactData", JSON.stringify(contact));

    // Отображаем сохраненные данные
    displaySavedContact();

    // Очищаем форму
    form.reset();
  });

  // Функция для отображения сохраненных данных
  function displaySavedContact() {
    const savedData = localStorage.getItem("contactData");

    if (savedData) {
      const contact = JSON.parse(savedData);

      document.getElementById("savedName").textContent = `Имя: ${contact.name}`;
      document.getElementById(
        "savedPhone"
      ).textContent = `Телефон: ${contact.phone}`;
      document.getElementById(
        "savedEmail"
      ).textContent = `Email: ${contact.email}`;

      contactDisplay.style.display = "block";
    } else {
      contactDisplay.style.display = "none";
    }
  }
});

///// 2 Задание /////

document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("expenseForm");
  const expensesContainer = document.getElementById("expensesContainer");
  const totalAmountElement = document.getElementById("totalAmount");

  // Загружаем расходы при загрузке страницы
  loadExpenses();

  // Обработчик отправки формы
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Получаем данные из формы
    const expense = {
      id: Date.now(), // Используем timestamp как уникальный ID
      description: document.getElementById("description").value,
      amount: parseFloat(document.getElementById("amount").value),
      date: document.getElementById("date").value,
    };

    // Добавляем расход в LocalStorage
    addExpense(expense);

    // Очищаем форму
    expenseForm.reset();
  });

  // Функция для добавления расхода
  function addExpense(expense) {
    let expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
  }

  // Функция для получения всех расходов
  function getExpenses() {
    const expenses = localStorage.getItem("expenses");
    return expenses ? JSON.parse(expenses) : [];
  }

  // Функция для удаления расхода
  function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter((expense) => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
  }
  // Функция для загрузки и отображения расходов
  function loadExpenses() {
    const expenses = getExpenses();
    expensesContainer.innerHTML = "";

    if (expenses.length === 0) {
      expensesContainer.innerHTML = "<p>Нет добавленных расходов</p>";
      totalAmountElement.textContent = "Общая сумма: 0 ₽";
      return;
    }

    // Сортируем по дате (новые сверху)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    let total = 0;

    expenses.forEach((expense) => {
      total += expense.amount;

      const expenseElement = document.createElement("div");
      expenseElement.className = "expense-item";
      expenseElement.innerHTML = `
            <div class="expense-info">
              <strong>${expense.description}</strong>
              <div>${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">
              ${expense.amount.toFixed(2)} ₽
            </div>
            <div class="expense-actions">
              <button onclick="deleteExpense(${expense.id})">Удалить</button>
            </div>
          `;

      expensesContainer.appendChild(expenseElement);
    });

    totalAmountElement.textContent = `Общая сумма: ${total.toFixed(2)} ₽`;
  }
  // Функция для форматирования даты
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  }

  // Делаем функцию удаления доступной глобально
  window.deleteExpense = deleteExpense;
});

///// 3 Задание /////

document.addEventListener("DOMContentLoaded", function () {
  const timerElement = document.getElementById("timer");
  let seconds = 0;

  // Проверяем, есть ли сохраненное время в sessionStorage
  const savedTime = sessionStorage.getItem("pageTime");
  if (savedTime) {
    seconds = parseInt(savedTime);
    updateTimerDisplay();
  }

  // Запускаем таймер
  const timer = setInterval(function () {
    seconds++;
    sessionStorage.setItem("pageTime", seconds.toString());
    updateTimerDisplay();
  }, 1000);

  // Обновляем отображение таймера
  function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Очищаем таймер при закрытии страницы (необязательно)
  window.addEventListener("beforeunload", function () {
    clearInterval(timer);
  });
});
