// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();

const profileContainer = document.getElementById("profile");
const btnLike = document.getElementById("like");
const btnDislike = document.getElementById("dislike");
const btnSendMessage = document.getElementById("sendMessage");
const btnNext = document.getElementById("next");
const btnClose = document.getElementById("close");

let currentProfile = null;

// URL вашего backend-сервера (HTTPS-ссылка)
const API_URL = "https://fruity-garlics-kick.loca.lt";
  // замените на ваш URL

// Функция загрузки анкеты с сервера
async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/profiles`);
    const data = await res.json();
    if (data.error) {
      profileContainer.innerHTML = "<p>Нет профилей.</p>";
    } else {
      currentProfile = data;
      displayProfile(data);
    }
  } catch (err) {
    console.error(err);
    profileContainer.innerHTML = "<p>Ошибка загрузки.</p>";
  }
}

// Отображение анкеты
function displayProfile(profile) {
  profileContainer.innerHTML = `
    <h2>${profile.name}, ${profile.age}</h2>
    <p>${profile.bio}</p>
    <p>Город: ${profile.city}</p>
    <p>Пол: ${profile.gender === "male" ? "Мужской" : "Женский"}</p>
    ${profile.photo ? `<img src="${profile.photo}" alt="Фото профиля" width="200">` : ""}
  `;
}

// Отправка лайка
async function sendLike() {
  if (!currentProfile) return;
  try {
    const res = await fetch(`${API_URL}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        liker_id: tg.initDataUnsafe.user.id,
        liked_id: currentProfile.user_id
      })
    });
    const data = await res.json();
    if (data.match) {
      alert("Взаимная симпатия!\nКонтакт: " + data.match.username);
    } else {
      alert("Лайк отправлен!");
    }
    loadProfile();
  } catch (err) {
    console.error(err);
  }
}

// Отправка анонимного сообщения
async function sendMessage() {
  if (!currentProfile) return;
  const text = prompt("Введите анонимное сообщение:");
  if (!text) return;
  try {
    await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: tg.initDataUnsafe.user.id,
        receiver_id: currentProfile.user_id,
        text: text
      })
    });
    alert("Сообщение отправлено!");
    loadProfile();
  } catch (err) {
    console.error(err);
  }
}

// Обработчики кнопок
btnLike.addEventListener("click", sendLike);
btnDislike.addEventListener("click", loadProfile);
btnSendMessage.addEventListener("click", sendMessage);
btnNext.addEventListener("click", loadProfile);
btnClose.addEventListener("click", () => tg.close());

loadProfile();
