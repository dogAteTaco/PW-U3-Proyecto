
let users = [];
let userField;
let passwordField;
let saveButton;
let deleteButton;
let typeButton;
let listedUsers;
let logged;
let isNewUser = false;
let errorArea;
let successArea;
let typeAdminButton;
let typeClientButton;

class User {
    constructor(id, password, type) {
        this.id = id;
        this.password = password;
        this.type = type;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    userField = document.getElementById("userField");
    passwordField = document.getElementById("passwordField");
    saveButton = document.getElementById("saveButton");
    deleteButton = document.getElementById("deleteButton");
    typeButton = document.getElementById("typeButton");
    listedUsers = document.getElementById("listedUsers");
    typeAdminButton = document.getElementById("typeAdmin");
    typeClientButton = document.getElementById("typeClient");
    logged = localStorage.getItem("logged");
    errorArea = document.getElementById("errorArea");
    successArea = document.getElementById("successArea");
    // If a user is already logged on it moves on to the landing page
    if (!logged)
        window.location.href = "../index.html";
    else {
        //Loads the users if there wasn't one logged in
        const usersData = JSON.parse(localStorage.getItem("users"));
        if (usersData) {
            users = usersData.map(item => new User(item.id, item.password, item.type));
        }

        if (isAdmin(localStorage.getItem("user"))) {
            // Verifies that the logged user is an admin
            listUsers();
            const addUserButton = document.getElementById("addUserButton");
            addUserButton.addEventListener("click", function (event) {
                event.preventDefault();
                userField.value = "";
                userField.removeAttribute("disabled");
                userField.focus();
                passwordField.value = "";
                isNewUser = true;

                passwordField.removeAttribute("disabled");
                saveButton.removeAttribute("disabled");
                deleteButton.setAttribute("disabled","true");
                typeButton.removeAttribute("disabled");
                typeButton.innerText = "Cliente";
            });

            saveButton.addEventListener("click", function(event){
                if(userExists(userField.value) && isNewUser)
                {
                    errorArea.setAttribute("style","display:grid");
                    errorArea.innerText = "Ya existe un usuario con ese Id.";
                }
                else if(userField.value.trim()==""||passwordField.value.length<5){
                    errorArea.setAttribute("style","display:grid");
                    errorArea.innerText = "Los campos de usuario y contrasena no deben estar vacios y la contrasena debe contener al menos 5 caracteres.";
                }
                else if(userExists(userField.value) && !isNewUser)
                {
                    let existingUser = users.find(u => u.id == userField.value);
                    existingUser.password = passwordField.value;
                    existingUser.type = typeButton.innerText.charAt(0);
                    errorArea.setAttribute("style","display:none");
                    successArea.innerText = "Se guardo el usuario correctamente.";
                    successArea.setAttribute("style","display:grid");
                    refreshUsers();
                }
                else
                {
                    addUser(userField.value, passwordField.value, typeButton.innerText.charAt(0));
                    deleteButton.removeAttribute("disabled");
                    errorArea.setAttribute("style","display:none");
                    successArea.innerText = "Se guardo el usuario correctamente.";
                    successArea.setAttribute("style","display:grid");
                    listUsers();
                    isNewUser = false;
                }
            });
            
            deleteButton.addEventListener("click",function(event){
                // Deletes the user from the list and the storage
                var index = users.map(x => {
                    return x.Id;
                    }).indexOf(userField.value);
                    
                    users.splice(index, 1);
                    refreshUsers();
                    listUsers();
                    userField.value = "";
                    passwordField.value = "";
                    userField.setAttribute("disabled","true");
                    passwordField.setAttribute("disabled","true");
                    saveButton.setAttribute("disabled","true");
                    deleteButton.setAttribute("disabled","true");
                    typeButton.setAttribute("disabled","true");
                    errorArea.setAttribute("style","display:none");
                    successArea.setAttribute("style","display:grid");
                    successArea.innerText("Se elimino el usuario correctamente.");
            });
            typeAdminButton.addEventListener("click", function(event){
                event.preventDefault();
                typeButton.innerText = typeAdminButton.innerText;
            });
            typeClientButton.addEventListener("click", function(event){
                event.preventDefault();
                typeButton.innerText = typeClientButton.innerText;
            });
        }
        else {
            // Returns the user to the login page if it's not an admin
            window.location.href = "../index.html";
        }
    }

});

// Function to add new users
function addUser(userId, userPass, userType) {
    if (userExists(userId)) {
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

function listUsers() {
    
    // Empties the users list
    listedUsers.innerHTML = "";

    users.forEach((user) => {
        //Creates a button for each user
        let userElement = document.createElement("button");
        userElement.className = "listedUser";
        userElement.textContent = user.id;
        // Creates an event listener for the click of the user button
        userElement.addEventListener("click", function (event) {
            event.preventDefault();
            // Enables the fields and buttons
            userField.setAttribute("disabled","true")
            passwordField.removeAttribute("disabled");
            saveButton.removeAttribute("disabled");
            deleteButton.removeAttribute("disabled");
            typeButton.removeAttribute("disabled");
            userField.value = user.id;
            passwordField.value = user.password;
            if (user.type == "A") {
                typeButton.innerText = "Administrador";
            }
            else{
                typeButton.innerText = "Cliente";
            }
            // Removes the ability to delete or change type of user of admin user
            if(user.id == "admin")
            {
                typeButton.setAttribute("disabled","true");
                deleteButton.setAttribute("disabled","true");
            }
            isNewUser = false;
            errorArea.setAttribute("style","display:none");
            successArea.setAttribute("style","display:none");
        });
        // Adds the button for the user on the list
        listedUsers.appendChild(userElement);

    });

}
// Verifies the login information of an user
function verifyLogin(userId, userPass) {
    return users.some(user => user.id === userId && user.password === userPass);
}

// Verifies the login information of an user
function isAdmin(userId) {
    return users.some(user => user.id === userId && user.type == "A");
}

// Check if a user already exists
function userExists(userId) {
    return users.some(user => user.id === userId);
}