async function validateForm(event) {
    event.preventDefault();

    const data = await getData();
    console.log(data);

    let noErrors = true;
    noErrors &= validateUsername();
    noErrors &= validateNames();
    noErrors &= validateEmail();
    noErrors &= validatePassword();
    noErrors &= validatePostcode();

    const username = document.getElementById('usernameInput').value;
    const usernameError = document.getElementById('usernameInputError');

    if (noErrors && isUsernameAvailable(username, data, usernameError)) {
        document.getElementById('successMessage').innerText = "Успешна регистрация";
        document.getElementById('errorMessage').innerText = "";
    } else {
        document.getElementById('successMessage').innerText = "";
        document.getElementById('errorMessage').innerText = "Има грешки във формата.";
    }
}

async function getData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

function validateUsername() {
    const username = document.forms["userInputForm"]["usernameInput"].value;
    const usernameInputError = document.getElementById("usernameInputError");

    if (!username) {
        usernameInputError.innerText = "Потребителското име е задължително";
        return false;
    }
    if (!(username.length >= 3 && username.length <= 10)) {
        usernameInputError.innerText = "Потребителското име трябва да е между 3-10 символа";
        return false;
    }

    usernameInputError.innerText = "";
    return true;
}

function validateNames() {
    const name = document.forms["userInputForm"]["namesInput"].value;
    const nameInputError = document.getElementById("namesInputError");

    if (!name) {
        nameInputError.innerText = "Имената са задължителни";
        return false;
    }
    if (name.length > 50) {
        nameInputError.innerText = "Имената трябва да са до 50 символа";
        return false;
    }

    nameInputError.innerText = "";
    return true;
}

function validateEmail() {
    const email = document.forms["userInputForm"]["emailInput"].value;
    const emailInputError = document.getElementById("emailInputError");

    if (!email) {
        emailInputError.innerText = "Имейлът е задължителен";
        return false;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        emailInputError.innerText = "Имейлът трябва да е валиден";
        return false;
    }

    emailInputError.innerText = "";
    return true;
}

function validatePassword() {
    const password = document.forms["userInputForm"]["passwordInput"].value;
    const passwordInputError = document.getElementById("passwordInputError");

    if (!password) {
        passwordInputError.innerText = "Паролата е задължителна";
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
    if (!passwordRegex.test(password)) {
        passwordInputError.innerText = "Паролата трябва да съдържа между 6 и 10 символа: главни и малки букви и цифри";
        return false;
    }

    passwordInputError.innerText = "";
    return true;
}

function validatePostcode() {
    const postcode = document.forms["userInputForm"]["postcodeInput"].value;
    const postcodeInputError = document.getElementById("postcodeInputError");

    if (postcode && !/^\d{5}(-\d{4})?$/.test(postcode)) {
        postcodeInputError.innerText = "Пощенският код е във формат 11111 или 11111-1111";
        return false;
    }

    postcodeInputError.innerText = "";
    return true;
}

function isUsernameAvailable(username, data, usernameInputError) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].username === username) {
            usernameInputError.innerText = "Потребителско име е заето";
            return false;
        }
    }
    return true;
}

