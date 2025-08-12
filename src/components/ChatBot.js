// components/ChatBot.js
export function createChatbot(app) {
  if (!app) {
    console.error("createChatbot: app element is required");
    return;
  }

  // === Разметка ===
  const chatbotContainer = document.createElement("div");
  chatbotContainer.classList.add("chatbot-popup");
  chatbotContainer.innerHTML = `
    <div class="chat-header">
      <div class="header-left">ЧАТЫ</div>
      <div class="header-right">
        <div class="header-info">
          <img src="https://static-basket-01.wbcontent.net/vol2/site/i/v3/chat/wb-support.svg" class="chatbot-logo" alt="Bot" />
          <div class="support-title">
            <h2>Поддержка</h2>
            <span></span>
          </div>
        </div>
        <button id="close-chatbot" aria-label="Закрыть">✕</button>
      </div>
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

  // === Элементы ===
  const messagesContainer = chatbotContainer.querySelector(".messages");
  const chatMain = chatbotContainer.querySelector(".chat-main");
  const chatList = chatbotContainer.querySelector(".chat-list");
  const chatBody = chatbotContainer.querySelector(".chat-body");
  const headerLeft = chatbotContainer.querySelector(".header-left");
  const headerInfo = chatbotContainer.querySelector(".header-info");
  const closeBtn = chatbotContainer.querySelector("#close-chatbot");

  // helper: сброс состояния тогглера (иконка и видимость)
  function resetTogglerIconAndShow() {
    const toggler = document.querySelector("#chatbot-toggler");
    if (toggler) {
      toggler.classList.remove("open"); // вернёт иконку к исходной
      toggler.style.display = ""; // восстановит видимость
    }
  }

  // helper: спрятать тогглер (display: none) — используется на мобилке при открытии
  function hideToggler() {
    const toggler = document.querySelector("#chatbot-toggler");
    if (toggler) {
      toggler.style.display = "none";
    }
  }

  const headerInfoHTML = headerInfo.innerHTML;

  // === Диалог ===
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
      text: `Проверьте уведомления в профиле на других устройствах. Если кода нет, попробуйте:\n— Проверить память телефона\n— Убедиться, что Wildberries не в чёрном списке\n— Проверить блокировку СМС оператором\n— Проверить сим-карту`,
      buttons: [
        { text: "Назад", next: "profile" },
        { text: "Все понятно", next: "clear" },
      ],
    },
    noNumber: {
      text: `К сожалению, нельзя изменить номер, к которому привязан профиль. Попробуйте восстановить сим-карту у оператора или обратитесь к нам для удаления профиля.`,
      buttons: [
        { text: "Назад", next: "profile" },
        { text: "Все понятно", next: "clear" },
      ],
    },
    clear: {
      text: "Всегда рада помочь!",
      buttons: [{ text: "Есть ещё вопрос", next: "menu" }],
    },
    menu: {
      text: "",
      buttons: [
        { text: "Узнать о пункте выдачи", next: "pickup" },
        { text: "Не могу зайти в профиль", next: "profile" },
      ],
    },
  };

  function addMessage(text, type = "bot") {
    const msg = document.createElement("div");
    msg.classList.add("message", type);

    if (type === "bot") {
      const sender = document.createElement("div");
      sender.className = "sender";
      sender.textContent = "Лина";
      msg.appendChild(sender);
    }

    const textNode = document.createElement("div");
    textNode.className = "text";
    textNode.textContent = text;
    msg.appendChild(textNode);

    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showStep(stepKey) {
    const step = dialogTree[stepKey];
    if (!step) return;

    if (step.text && String(step.text).trim() !== "") {
      addMessage(step.text, "bot");
    }

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "buttons-wrapper";

    const label = document.createElement("div");
    label.className = "answer-label";
    label.textContent = "Ваш ответ";
    btnWrapper.appendChild(label);

    const row = document.createElement("div");
    row.className = "buttons-row";

    step.buttons.forEach((btnData) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = btnData.text;
      btn.className = "chat-option";
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        addMessage(btnData.text, "user");
        messagesContainer
          .querySelectorAll(".buttons-wrapper")
          .forEach((b) => b.remove());
        showStep(btnData.next);
      });
      row.appendChild(btn);
    });

    btnWrapper.appendChild(row);
    messagesContainer.appendChild(btnWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // === Поведение по виду ===
  function isMobileView() {
    return window.innerWidth <= 1024;
  }

  function showListMobile() {
    chatMain.classList.remove("chat-open");
    chatList.style.display = "flex";
    chatBody.style.display = "none";
    headerLeft.textContent = "ЧАТЫ";
    headerInfo.style.display = "none";
  }

  function showChatMobile() {
    chatMain.classList.add("chat-open");
    chatList.style.display = "none";
    chatBody.style.display = "flex";
    headerLeft.innerHTML = headerInfoHTML;
    headerInfo.style.display = "none";
  }

  function showDesktopView() {
    chatMain.classList.remove("chat-open");
    chatList.style.display = "";
    chatBody.style.display = "flex";
    headerLeft.textContent = "ЧАТЫ";
    headerInfo.style.display = "";
  }

  function resetViewOnClose() {
    headerInfo.style.display = "";
    headerLeft.textContent = "ЧАТЫ";
    chatMain.classList.remove("chat-open");
    chatList.style.display = "";
    chatBody.style.display = "flex";
    messagesContainer.innerHTML = "";
    resetTogglerIconAndShow();
  }

  // === Обработчики ===

  // клик по списку чатов
  chatList.addEventListener("click", (e) => {
    const item = e.target.closest(".chat-item");
    if (!item) return;

    chatList
      .querySelectorAll(".chat-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    if (isMobileView()) {
      showChatMobile();
      messagesContainer.innerHTML = "";
      showStep("start");
    } else {
      messagesContainer.innerHTML = "";
      showStep("start");
    }
  });

  // крестик в header
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isMobileView() && chatMain.classList.contains("chat-open")) {
      // возвращаемся к списку
      showListMobile();
      messagesContainer.innerHTML = "";
    } else {
      // закрываем модалку полностью
      chatbotContainer.classList.remove("open");
      app.classList.remove("show-chatbot");
      resetViewOnClose();
    }
  });

  // клик вне модалки закрывает её
  document.addEventListener("click", (e) => {
    if (
      !chatbotContainer.contains(e.target) &&
      !e.target.closest("#chatbot-toggler")
    ) {
      chatbotContainer.classList.remove("open");
      app.classList.remove("show-chatbot");
      resetViewOnClose();
    }
  });

  chatbotContainer.addEventListener("click", (e) => e.stopPropagation());

  // ресайз — если модалка открыта, подстраиваем вид
  window.addEventListener("resize", () => {
    if (!chatbotContainer.classList.contains("open")) return;
    if (isMobileView()) {
      showListMobile();
    } else {
      showDesktopView();
      messagesContainer.innerHTML = "";
      showStep("start");
    }
  });

  // по умолчанию модалка НЕ открыта
  chatbotContainer.classList.remove("open");
  app.classList.remove("show-chatbot");

  return { container: chatbotContainer, showStep, resetViewOnClose };
}

// === toggler ===
export function createChatbotToggler(app, chatbot) {
  if (!app || !chatbot?.container) return;

  const chatbotToggler = document.createElement("button");
  chatbotToggler.id = "chatbot-toggler";

  chatbotToggler.innerHTML = `
    <span class="chatbot__icon-open">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
        <path fill="#fff" fill-rule="evenodd" d="M1.038 3.816C.736 4.518.82 5.428.992 7.248l.6 6.4c.144 1.537.216 2.305.562 2.886a3 3 0 0 0 1.291 1.176c.61.29 1.383.29 2.926.29H7.84c.056 0 .084 0 .105.01a.1.1 0 0 1 .044.045c.01.021.01.049.01.105v4.047c0 .095 0 .143.02.17a.1.1 0 0 0 .074.04c.033.002.073-.024.153-.076l6.714-4.316c.015-.009.022-.014.03-.017a.098.098 0 0 1 .022-.006c.009-.002.017-.002.035-.002h2.582c1.543 0 2.315 0 2.925-.29a3 3 0 0 0 1.292-1.176c.346-.581.418-1.35.562-2.886l.6-6.4c.17-1.82.256-2.73-.046-3.432a3 3 0 0 0-1.32-1.45C20.97 2 20.057 2 18.229 2H5.77c-1.828 0-2.742 0-3.413.366a3 3 0 0 0-1.32 1.45ZM12 8.5a1.5 1.5 0 0 0 0 3h.01a1.5 1.5 0 0 0 0-3H12ZM6 10a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 0 3H7.5A1.5 1.5 0 0 1 6 10Zm10.5-1.5a1.5 1.5 0 0 0 0 3h.01a1.5 1.5 0 0 0 0-3h-.01Z" clip-rule="evenodd"/>
      </svg>
    </span>
    <span class="material-symbols-rounded">close</span>
  `;

  app.appendChild(chatbotToggler);

  chatbotToggler.addEventListener("click", (e) => {
    e.stopPropagation();

    // один toggle — переключаем открыто/закрыто
    const nowOpen = !chatbot.container.classList.contains("open");
    chatbot.container.classList.toggle("open");
    chatbotToggler.classList.toggle("open");

    if (nowOpen) {
      // открываем: выставляем состояние в зависимости от ширины
      if (window.innerWidth <= 1024) {
        chatbot.container.querySelector(".chat-list").style.display = "flex";
        chatbot.container.querySelector(".chat-body").style.display = "none";
        chatbot.container.querySelector(".header-info").style.display = "none";
        chatbot.container.querySelector(".header-left").textContent = "ЧАТЫ";

        // на мобильных — прячем сам тогглер
        // (его восстановит resetViewOnClose / resetTogglerIconAndShow при закрытии модалки)
        chatbotToggler.style.display = "none";
      } else {
        chatbot.container.querySelector(".chat-list").style.display = "";
        chatbot.container.querySelector(".chat-body").style.display = "flex";
        chatbot.container.querySelector(".header-info").style.display = "";
        chatbot.container.querySelector(".header-left").textContent = "ЧАТЫ";

        // чистим и запускаем стартовый шаг
        const messages = chatbot.container.querySelector(".messages");
        messages.innerHTML = "";
        chatbot.showStep("start");
      }
      app.classList.add("show-chatbot");
    } else {
      // закрываем
      app.classList.remove("show-chatbot");
      chatbot.resetViewOnClose?.(); // внутри неё мы восстановим тогглер
    }
  });

  return chatbotToggler;
}
