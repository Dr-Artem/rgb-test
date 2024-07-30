import Notiflix from 'notiflix';

const input = document.querySelector('#phone');
const iti = window.intlTelInput(input, {
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/23.7.3/js/utils.min.js',
});

document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    let errors = [];

    const namePattern = /^[^\d]*$/;
    if (name && !namePattern.test(name)) {
        errors.push("Ім'я і прізвище не можуть містити цифр");
    }
    const phonePattern = /^\+?[0-9]{10,15}$/;
    const number = iti.getNumber();
    if (phone && !phonePattern.test(number)) {
        errors.push('Неправильний формат номеру телефону');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        errors.push('Неправильний формат email');
    }

    if (errors.length > 0) {
        errors.forEach(error => Notiflix.Notify.failure(error));
    } else {
        const message = `Name: ${name}\nPhone: ${number ? number : phone}\nName: ${email}`;

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.CHAT_ID;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    Notiflix.Notify.success('Форма успішно відправлена!');
                } else {
                    Notiflix.Notify.failure('Сталася помилка під час відправки!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // this.submit();
    }
});
