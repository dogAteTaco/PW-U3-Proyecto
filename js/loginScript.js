
const adminuser = 'admin';
const adminpass = "12345";
let logged;
let user;
let users = [];
class User {
    constructor(id, password, type) {
        this.id = id;
        this.password = password;
        this.type = type;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const userInput = document.getElementById("userInput");
    const passwordInput = document.getElementById("passwordInput");

    // Check if a user is already logged in
    logged = localStorage.getItem("logged");
    // If a user is already logged on it moves on to the landing page
    if (logged)
        window.location.href = "html/landing.html";
    else {
        //Loads the users if there wasn't one logged in
        const usersData = JSON.parse(localStorage.getItem("users"));
        if (usersData) {
            users = usersData.map(item => new User(item.id, item.password, item.type));
        }
        // Adds the admin user if it doesn't exist
        addUser(adminuser, adminpass, 'A');

        // Adds the code to verify the login in the Login Button
        loginButton.addEventListener("click", function (event) {
            event.preventDefault();

            //Check for admin user
            if (verifyLogin(userInput.value, passwordInput.value)) {
                window.location.href = "html/landing.html";
                logged = true;
                localStorage.setItem("logged", "true");
                localStorage.setItem("user", userInput.value);
            }
            else
            {
                localStorage.setItem("logged", "false");
            }
        });
    }
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


