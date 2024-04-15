// script.js
let completeCatalog;

let added = 0;
let total = 0;
var typeFilter = "all";
let userLogged;
let users = [];

class User {
    constructor(name, password, type) {
        this.name = name;
        this.password = password;
        this.type = type;
    }
}

class CartItem {
    constructor(name, quantity, price, image) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.image = image;
    }
}

class Product {
    constructor(id, name, price, image, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.type = type;
    }
}

let cartItems = [];

// If a user is already logged on it moves on to the landing page
if (!localStorage.getItem("logged"))
    window.location.href = "../index.html";

document.addEventListener("DOMContentLoaded", function () {

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
    const catalogJSON = localStorage.getItem("catalog");

    if (catalogJSON)
        completeCatalog = JSON.parse(catalogJSON);
    if (!completeCatalog) {
        completeCatalog = [
            { "id": "1", "name": "Small Talk", "author": "Soda Blonde", "image": "https://f4.bcbits.com/img/a1547517492_10.jpg", "price": 10, "type": "CD" },
            { "id": "2", "name": "Dream Big", "author": "Soda Blonde", "image": "https://f4.bcbits.com/img/a3462523954_10.jpg", "price": 15, "type": "CD" },
            { "id": "3", "name": "Jeff Buckley", "author": "Jeff Buckley", "image": "jeffbuckley.jpg", "price": 20, "type": "CD" },
            { "id": "4", "name": "Primal Heart", "author": "Kimbra", "image": "primarheart.jpg", "price": 12, "type": "CD" },
            { "id": "5", "name": "House of Leaves", "author": "Mark Z. Danielewski", "image": "houseofleaves.jpg", "price": 31.25, "type": "Book" },
            { "id": "6", "name": "L'enfant Sauvage", "author": "Gojira", "image": "lenfantsauvage.jpg", "price": 14, "type": "CD" },
            { "id": "7", "name": "sungazer vol. 2", "author": "sungazer", "image": "https://f4.bcbits.com/img/a2615531513_10.jpg", "price": 13, "type": "CD" },
            { "id": "8", "name": "The Way of All Flesh", "author": "Gojira", "image": "wayofallflesh.jpg", "price": 18, "type": "CD" },
            { "id": "9", "name": "Magma", "author": "Gojira", "image": "magma.jpg", "price": 15, "type": "CD" },
            { "id": "10", "name": "Fortitude", "author": "Gojira", "image": "fortitude.jpg", "price": 13, "type": "CD" },
            { "id": "11", "name": "The Long Dark Blue", "author": "Swain", "image": "https://f4.bcbits.com/img/a0730532010_10.jpg", "price": 18, "type": "CD" },
            { "id": "12", "name": "Farenheit 451", "author": "Ray Bradbury", "image": "farenheit.jpg", "price": 12, "type": "Book" },
            { "id": "13", "name": "30", "author": "Adele", "image": "30.jpg", "price": 19, "type": "CD" },
            { "id": "14", "name": "Metro 2033", "author": "Dmitry Glukhovsky", "image": "metro2033.jpg", "price": 13, "type": "Book" }
        ];
        const catalogJSON = JSON.stringify(completeCatalog);
        localStorage.setItem("catalog", catalogJSON);
    }

    loadProducts(completeCatalog);
    const searchButton = document.getElementById("searchbutton");
    const searchBar = document.getElementById("searchbar");
    const allItems = document.getElementById("allItems");
    const cdItems = document.getElementById("cdItems");
    const bookItems = document.getElementById("bookItems");
    const catButton = document.getElementById("categoriesButton");
    const logoutButton = document.getElementById("logoutButton");
    const usersData = JSON.parse(localStorage.getItem("users"));
    if (usersData) {
        users = usersData.map(item => new User(item.id, item.password, item.type));
    }

    //Adds the name of the logged-in user
    const userButton = document.getElementById("userButton");
    userLogged = localStorage.getItem("user");
    if (userLogged) {
        userButton.innerHTML = "<span style=\"font-size: small;\">Hola <strong style=\"font-weight: bold;\">" + userLogged + "</strong></span>";
    }
    addUserOptions(userLogged);
    //Loads the saved cart
    const cartData = JSON.parse(localStorage.getItem("cart"));

    console.log(cartData);
    if (cartData) {
        cartItems = cartData.map(item => new CartItem(item.name, item.quantity, item.price, item.image));
        refreshCart();
    }

    allItems.addEventListener("click", function () {
        typeFilter = "all";
        filterProducts(searchBar.value);
        catButton.textContent = "Todas las categorías";
    });

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("logged");
        localStorage.removeItem("user");
        window.location.href = "../index.html";
    });

    cdItems.addEventListener("click", function () {
        typeFilter = "cd";
        filterProducts(searchBar.value);
        catButton.textContent = "Albúms";
    });

    bookItems.addEventListener("click", function () {
        typeFilter = "book";
        filterProducts(searchBar.value);
        catButton.textContent = "Libros";
    });

    searchButton.addEventListener("click", function () {
        filterProducts(searchBar.value);
    });

    searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filterProducts(searchBar.value);
        }
    });



});

function loadProducts(catalog) {
    const catalogContainer = document.getElementById("catalogo");
    catalogContainer.innerHTML = "";
    // Genera las tarjetas de productos en el catálogo
    catalog.forEach((product) => {
        const card = document.createElement("div");
        //card.classList.add("col-md-4", "mb-4");
        let imageURL = product.image;
        if (!product.image.toLowerCase().startsWith("http"))
            imageURL = "../img/products/" + product.image;
        card.innerHTML = `
            <div class="card-container">
                <div class="card">
                    <div><img src="${imageURL}" class="card-img-top" alt="${product.name}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-author">${product.author}</p>
                        <div class="card-price">
                            <span class="main-price">$${parseInt(product.price)}</span>
                            <span class="cents">${(product.price % 1).toFixed(2).substr(2)}</span>
                        </div>
                        <input type="number" min="0" class="form-control" data-id="cantidadProducto" value="1">
                        <button class="cantidadField btn btn-primary mt-2" data-id="${product.name}">Añadir</button>
                    </div>
                </div>
            </div>
            `;
        catalogContainer.appendChild(card);

    });
    const buttons = document.querySelectorAll('.cantidadField');



    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const buttonValue = this.getAttribute('data-id');
            const cardContainer = this.closest('.card-container');

            const inputField = cardContainer.querySelector('input[data-id="cantidadProducto"]');

            const inputValue = inputField.value;
            // Get the sibling <h5> element
            const h5Element = cardContainer.querySelector('.card-title');
            const h5Value = h5Element.textContent; // Retrieve the text content
            let currentItem = completeCatalog.find((p) => p.name === buttonValue);
            if (!cartItems.some(e => e.name === h5Value)) {
                cartItems.push(new CartItem(buttonValue, inputValue, currentItem.price, currentItem.image));
                added = added + 1;
            }
            else {
                const product = cartItems.find(p => p.name === buttonValue);
                product.quantity = Number.parseInt(product.quantity) + Number.parseInt(inputValue);
            }
            refreshCart();

        });
    });

}


function refreshCart() {
    const cartTag = document.getElementById("cart");
    const cartTotal = document.getElementById("totalSpan");
    //Resets the total
    total = 0;
    added = cartItems.length;
    const items = document.getElementById("cartItems");
    items.innerHTML = "";
    let itemDiv = document.createElement("div");
    // Recalculates the total of the cart
    cartItems.forEach((item) => {
        const product = completeCatalog.find(producto => producto.name === item.name);
        const price = Number.parseFloat(product.price);
        currentItem = completeCatalog.find((p) => p.name === item.name);
        total = Number.parseFloat(total) + Number.parseFloat(item.quantity) * price;
        itemDiv = document.createElement("div");

        let imageURL = currentItem.image;
        if (!product.image.toLowerCase().startsWith("http"))
            imageURL = "../img/products/" + product.image;

        itemDiv.innerHTML = `
        <div class="cartItem" style="">
            <div style="display: inline; margin-right:10px;"><img src="${imageURL}"></div>
            <span style="flex-grow: 1; padding-right: 15px;">${currentItem.name}</span>
            <span style="text-align: right;">$${currentItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x${item.quantity}</span>
            <span><button class="cartDeleteButton" style=""><img style="width: 30px; height:30px" src="../img/red-x-icon.png"></button></span>
        </div>
        `;

        var deleteButton = itemDiv.querySelector('.cartDeleteButton');

        // Add event listener to the delete button
        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation();
            // Get the parent div of the delete button, which is the cartItem div
            var cartItemDiv = deleteButton.closest('.cartItem');
            // Get the span containing the currentItem.id
            var nameSpan = cartItemDiv.querySelector('span:nth-child(2)');

            // Removes it based on the ID of the row
            removeById(nameSpan.textContent);
            // Remove the cartItem div
            cartItemDiv.remove();
            refreshCart();
            // Get a reference to the dropdown menu's parent element
            var dropdownParent = document.querySelector('.dropdown-menu').parentNode;

            // Add the 'show' class to the dropdown menu's parent element to open the dropdown
            dropdownParent.classList.add('show');
        });

        // Append the itemDiv to the items container
        items.appendChild(itemDiv);
    });

    localStorage.setItem("cart", JSON.stringify(cartItems));
    cartTotal.textContent = "$" + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    cartTag.textContent = added;
}
// Filtra los productos basados en tipo, author o nombre
function filterProducts(filter) {
    const lowerCaseFilter = filter.toLowerCase();
    const filteredItems = completeCatalog.filter(item => {
        const lowerCaseId = item.name.toLowerCase();
        const lowerCaseAutor = item.author.toLowerCase();
        const lowerCaseTipo = item.type.toLowerCase();
        return (filter === "" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter)) && (typeFilter === "all" || lowerCaseTipo === typeFilter.toLowerCase());
    });

    loadProducts(filteredItems);
}

// Verifies the user is Admin
function isAdmin(userId) {
    return users.some(user => user.name === userId && user.type == "A");
}

function addUserOptions(userId) {
    const userOptionsDiv = document.getElementById("userOptions");
    if (isAdmin(userId)) {
        userOptionsDiv.innerHTML = "<a class=\"dropdown-item\" href=\"catalog.html\"><span>Catálogo</span></a>" +
            "<a class=\"dropdown-item\" href=\"user.html\"><span>Usuarios</span></a>";
    }

}


// Assuming this function adds the cartItem dynamically
function addCartItem(currentItem) {
    // Create the cartItem div
    var cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cartItem';
    cartItemDiv.style.width = '280px';
    cartItemDiv.style.display = 'flex';
    cartItemDiv.style.alignItems = 'center';

    // Create the image element
    var imgDiv = document.createElement('div');
    imgDiv.style.display = 'inline';
    imgDiv.style.marginRight = '10px';
    var img = document.createElement('img');
    img.src = '../img/products/' + currentItem.image;
    imgDiv.appendChild(img);
    cartItemDiv.appendChild(imgDiv);

    // Create the span elements
    var nameSpan = document.createElement('span');
    nameSpan.style.flexGrow = '1';
    nameSpan.style.paddingRight = '15px';
    nameSpan.textContent = currentItem.name;
    cartItemDiv.appendChild(nameSpan);

    var priceSpan = document.createElement('span');
    priceSpan.style.textAlign = 'right';
    priceSpan.textContent = '$' + currentItem.price + 'x' + item.quantity;
    cartItemDiv.appendChild(priceSpan);

    // Create the delete button
    var deleteButton = document.createElement('button');
    deleteButton.className = 'cartDeleteButton';
    deleteButton.style.border = '0px';
    deleteButton.style.backgroundColor = 'transparent';
    deleteButton.addEventListener('click', function () {
        // Remove the cartItem div when the button is clicked
        cartItemDiv.remove();
    });

    var deleteImg = document.createElement('img');
    deleteImg.style.width = '30px';
    deleteImg.style.height = '30px';
    deleteImg.src = '../img/red-x-icon.png';
    deleteButton.appendChild(deleteImg);
    var deleteSpan = document.createElement('span');
    deleteSpan.appendChild(deleteButton);
    cartItemDiv.appendChild(deleteSpan);

    // Append the cartItem div to the container
    var container = document.getElementById('cartContainer'); // Change 'cartContainer' to the actual ID of your container
    container.appendChild(cartItemDiv);
}


function removeById(name) {
    const index = cartItems.findIndex(item => item.name === name);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
};