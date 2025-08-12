export function createChatbot() {
  // ...тот же код создания контейнера и разметки...

  const chatbotContainer = document.createElement("div");
  chatbotContainer.classList.add("chatbot-popup");
  chatbotContainer.innerHTML = `
    <div class="chat-header">
      <div class="header-info">
        <img src="src/assets/chatbot.svg" class="chatbot-logo" alt="Bot" />
        <h2 class="logo-text">Лина</h2>
      </div>
      <button id="close-chatbot" class="material-symbols-rounded">close</button>
    </div>
    <div class="chat-main">
      <aside class="chat-list">
        <div class="chat-item active">Чат с поддержкой</div>
      </aside>
      <div class="chat-body">
        <div class="messages"></div>
      </div>
    </div>
  `;
  app.appendChild(chatbotContainer);

  const messagesContainer = chatbotContainer.querySelector(".messages");
  const dialogTree = {
    start: {
      text: "Здравствуйте! Чем могу помочь?",
      buttons: [
        { text: "Узнать о пункте выдачи", next: "pickup" },
        { text: "Не могу зайти в профиль", next: "profile" },
      ],
    },
    pickup: {
      text: "Вся важная информация о работе пунктов выдачи есть на сайте: адрес, график работы и другое.",
      buttons: [
        { text: "Назад", next: "start" },
        { text: "Все понятно", next: "clear" },
        { text: "Вернуться в начало", next: "start" },
      ],
    },
    profile: {
      text: "Выберите проблему:",
      buttons: [
        { text: "Не приходит код подтверждения", next: "noCode" },
        { text: "Нет доступа к старому номеру", next: "noNumber" },
        { text: "Назад", next: "start" },
      ],
    },
    noCode: {
      text: `Проверьте уведомления в профиле на других устройствах, раздел обозначен значком колокольчика. Если кода нет, попробуйте:
— Проверьте, есть ли у вас свободная память на телефоне.
— Возможно, вы добавили Wildberries в чёрный список.
— Возможно, сотовый оператор блокирует СМС.
— Может быть, у вас неисправна сим-карта.`,
      buttons: [
        { text: "Назад", next: "profile" },
        { text: "Все понятно", next: "clear" },
        { text: "Вернуться в начало", next: "start" },
      ],
    },
    noNumber: {
      text: `К сожалению, нельзя изменить номер телефона, к которому привязан профиль. Попробуйте восстановить сим-карту у оператора. Если невозможно — обратитесь к нам для удаления профиля.`,
      buttons: [
        { text: "Назад", next: "profile" },
        { text: "Все понятно", next: "clear" },
        { text: "Вернуться в начало", next: "start" },
      ],
    },
    clear: {
      text: "Всегда рада помочь!",
      buttons: [{ text: "Есть ещё вопрос", next: "start" }],
    },
  };
  // Диалоговое дерево и функции addMessage и showStep — оставляем без изменений, кроме одной правки:
  function addMessage(text, type = "bot") {
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showStep(stepKey) {
    const step = dialogTree[stepKey];
    if (!step) return;

    addMessage(step.text, "bot");

    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("buttons-wrapper");
    // При создании кнопок в showStep:
    step.buttons.forEach((btnData) => {
      const btn = document.createElement("button");
      btn.textContent = btnData.text;
      btn.classList.add("chat-option");
      btn.addEventListener("click", (event) => {
        event.stopPropagation(); // <--- это важно
        addMessage(btnData.text, "user");
        messagesContainer
          .querySelectorAll(".buttons-wrapper")
          .forEach((b) => b.remove());
        showStep(btnData.next);
      });
      btnWrapper.appendChild(btn);
    });

    // Запрет всплытия кликов внутри контейнера чата:
    chatbotContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    messagesContainer.appendChild(btnWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Кнопка закрытия чата — закрывает окно
  const closeBtn = chatbotContainer.querySelector("#close-chatbot");
  closeBtn.addEventListener("click", () => {
    chatbotContainer.classList.remove("open");
  });

  // Закрытие кликом вне контейнера — как было
  document.addEventListener("click", (e) => {
    if (
      !chatbotContainer.contains(e.target) &&
      !e.target.closest("#chatbot-toggler")
    ) {
      chatbotContainer.classList.remove("open");
    }
  });

  return {
    container: chatbotContainer,
    showStep,
  };
}

export function createChatbotToggler(appSelector, chatbot) {
  const app = document.querySelector(appSelector);
  if (!app) {
    console.error("Элемент не найден:", appSelector);
    return;
  }

  const chatbotToggler = document.createElement("button");
  chatbotToggler.id = "chatbot-toggler";

  const iconOpen = document.createElement("span");
  iconOpen.className = "chatbot__icon-open";
  iconOpen.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
      <path fill="#fff" fill-rule="evenodd" d="M1.038 3.816C.736 4.518.82 5.428.992 7.248l.6 6.4c.144 1.537.216 2.305.562 2.886a3 3 0 0 0 1.291 1.176c.61.29 1.383.29 2.926.29H7.84c.056 0 .084 0 .105.01a.1.1 0 0 1 .044.045c.01.021.01.049.01.105v4.047c0 .095 0 .143.02.17a.1.1 0 0 0 .074.04c.033.002.073-.024.153-.076l6.714-4.316c.015-.009.022-.014.03-.017a.098.098 0 0 1 .022-.006c.009-.002.017-.002.035-.002h2.582c1.543 0 2.315 0 2.925-.29a3 3 0 0 0 1.292-1.176c.346-.581.418-1.35.562-2.886l.6-6.4c.17-1.82.256-2.73-.046-3.432a3 3 0 0 0-1.32-1.45C20.97 2 20.057 2 18.229 2H5.77c-1.828 0-2.742 0-3.413.366a3 3 0 0 0-1.32 1.45ZM12 8.5a1.5 1.5 0 0 0 0 3h.01a1.5 1.5 0 0 0 0-3H12ZM6 10a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 0 3H7.5A1.5 1.5 0 0 1 6 10Zm10.5-1.5a1.5 1.5 0 0 0 0 3h.01a1.5 1.5 0 0 0 0-3h-.01Z" clip-rule="evenodd"/>
    </svg>
  `;

  const iconClose = document.createElement("span");
  iconClose.className = "material-symbols-rounded";
  iconClose.textContent = "close";

  chatbotToggler.append(iconOpen, iconClose);

  app.appendChild(chatbotToggler);

  chatbotToggler.addEventListener("click", () => {
    chatbot.container.classList.toggle("open");
    if (chatbot.container.classList.contains("open")) {
      const messagesContainer = chatbot.container.querySelector(".messages");
      messagesContainer.innerHTML = ""; // очистка перед новым диалогом
      chatbot.showStep("start"); // показываем приветствие
      app.classList.add("show-chatbot");
    } else {
      app.classList.remove("show-chatbot");
    }
  });

  return chatbotToggler;
}
