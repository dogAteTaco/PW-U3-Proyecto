
const adminuser = 'admin';
const adminpass = "12345";
let logged = localStorage.getItem("logged");
let user;
let users = [];
class User {
    constructor(id, password, type) {
        this.id = id;
        this.password = password;
        this.type = type;
    }
}

if (logged)
    window.location.href = "html/landing.html";

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const userInput = document.getElementById("userInput");
    const passwordInput = document.getElementById("passwordInput");
    //localStorage.clear();
    // Check if a user is already logged in
    
    // If a user is already logged on it moves on to the landing page

    //Loads the users if there wasn't one logged in
    const usersData = JSON.parse(localStorage.getItem("users"));
    // console.log(localStorage.getItem("users"));
    if (usersData) {
        users = usersData.map(item => new User(item.id, item.password, item.type));
    }
    console.log(users);
    // Adds the admin user if it doesn't exist
    addUser(adminuser, adminpass, 'A');
    addUser('cliente', '12345', 'C');

    // Adds the code to verify the login in the Login Button
    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(users);
        //Check for admin user
        if (verifyLogin(userInput.value, passwordInput.value)) {
            window.location.href = "html/landing.html";
            logged = true;
            console.log(users);
            localStorage.setItem("logged", "true");
            localStorage.setItem("user", userInput.value);
        }
        else {
            localStorage.setItem("logged", "false");
            localStorage.removeItem("user");
            logged = false;
            const errorArea = document.getElementById("errorArea");
            errorArea.setAttribute("style", "display:grid");
            errorArea.innerText = "Usuario o contraseña incorrectos.";
        }
    });
});

// Function to add new users
function addUser(userId, userPass, userType) {
    if (isUserWithIdExists(userId)) {
        console.log(`User with ID ${userId} exists.`);
    } else {
        users.push(new User(userId, userPass, userType));
        refreshUsers();
    }
}

// Refreshes the users on the localstorage
function refreshUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// Check if a user already exists
function isUserWithIdExists(userId) {
    return users.some(user => user.id === userId);
}

// Verifies the login information of an user
function verifyLogin(userId, userPass) {
    return users.some(user => user.id === userId && user.password === userPass);
}


