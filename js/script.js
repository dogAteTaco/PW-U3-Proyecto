// script.js
const catalogoCompleto = [
    { id: "Small Talk", autor: "Soda Blonde", imagen: "sodablonde1.jpg", precio: 10, tipo: "CD" },
    { id: "Dream Big", autor: "Soda Blonde", imagen: "sodablonde2.jpg", precio: 15, tipo: "CD" },
    { id: "Jeff Buckley", autor: "Jeff Buckley", imagen: "jeffbuckley.jpg", precio: 20, tipo: "CD" },
    { id: "Primal Heart", autor: "Kimbra", imagen: "primarheart.jpg", precio: 12, tipo: "CD" },
    { id: "House of Leaves", autor: "Mark Z. Danielewski", imagen: "houseofleaves.jpg", precio: 31.25, tipo: "Book" },
    { id: "L'enfant Sauvage", autor: "Gojira", imagen: "lenfantsauvage.jpg", precio: 14, tipo: "CD" },
    { id: "The Way of All Flesh", autor: "Gojira", imagen: "wayofallflesh.jpg", precio: 18, tipo: "CD" },
    { id: "Magma", autor: "Gojira", imagen: "magma.jpg", precio: 15, tipo: "CD" },
    { id: "Fortitude", autor: "Gojira", imagen: "fortitude.jpg", precio: 13, tipo: "CD" },
    { id: "The Long Dark Blue", autor: "Swain", imagen: "longdarkblue.jpg", precio: 18, tipo: "CD" },
    { id: "Farenheit 451", autor: "Ray Bradbury", imagen: "farenheit.jpg", precio: 12, tipo: "Book" },
    { id: "30", autor: "Adele", imagen: "30.jpg", precio: 19, tipo: "CD" },
    { id: "Metro 2033", autor: "Dmitry Glukhovsky", imagen: "metro2033.jpg", precio: 13, tipo: "Book" },
];

let added = 0;
let total = 0;
var tipoFiltro = "all";
let userLogged;
let users = [];
class User {
    constructor(id, password, type) {
        this.id = id;
        this.password = password;
        this.type = type;
    }
}
class CartItem {
    constructor(id, quantity, price, image) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.image = image;
    }
}
let cartItems = [];

logged = localStorage.getItem("logged");
    // If a user is already logged on it moves on to the landing page
    if (!logged)
        window.location.href = "../index.html";

document.addEventListener("DOMContentLoaded", function () {

    
    cargarProductos(catalogoCompleto);
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
    if(userLogged)
        userButton.innerHTML = "<span style=\"font-size: small;\">Hola "+userLogged+"</span>";
    addUserOptions(userLogged);
    //Loads the saved cart
    const cartData = JSON.parse(localStorage.getItem("cart"));
    
    console.log(cartData);
    if(cartData)
    {
        cartItems = cartData.map(item => new CartItem(item.id, item.quantity, item.price,item.image));
        refreshCart();
    }
        
    allItems.addEventListener("click",function(){
        tipoFiltro = "all";
        filtrar(searchBar.value);
        catButton.textContent = "Todas las categorías";
    });

    logoutButton.addEventListener("click",function(){
        localStorage.clear();
        window.location.href = "../index.html";
    });

    cdItems.addEventListener("click",function(){
        tipoFiltro = "cd";
        filtrar(searchBar.value);
        catButton.textContent = "Albúms";
    });

    bookItems.addEventListener("click",function(){
        tipoFiltro = "book";
        filtrar(searchBar.value);
        catButton.textContent = "Libros";
    });

    searchButton.addEventListener("click", function () {
        filtrar(searchBar.value);
    });
    
    searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filtrar(searchBar.value);
        }
    });
    
    

});

function cargarProductos(catalogo) {
    const catalogoContainer = document.getElementById("catalogo");
    catalogoContainer.innerHTML = "";
    // Genera las tarjetas de productos en el catálogo
    catalogo.forEach((producto) => {
        const card = document.createElement("div");
        //card.classList.add("col-md-4", "mb-4");
        card.innerHTML = `
            <div class="card-container">
                <div class="card">
                    <div><img src="../img/products/${producto.imagen}" class="card-img-top" alt="${producto.id}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.id}</h5>
                        <p class="card-author">de ${producto.autor}</p>
                        <p class="card-text">$${producto.precio}</p>
                        <input type="number" min="0" class="form-control" data-id="cantidadProducto" value="1">
                        <button class="cantidadField btn btn-primary mt-2" data-id="${producto.id}">Añadir a Carrito</button>
                    </div>
                    </div>
                </div>
            </div>
            `;
        catalogoContainer.appendChild(card);

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
            let currentItem = catalogoCompleto.find((p) => p.id===buttonValue);
            if (!cartItems.some(e => e.id === h5Value)) {
                cartItems.push(new CartItem(buttonValue, inputValue,currentItem.precio,currentItem.imagen));
                added = added + 1;
            }
            else
            {
                const product = cartItems.find(producto => producto.id === buttonValue);
                product.quantity = Number.parseInt(product.quantity)+Number.parseInt(inputValue);
            }
            refreshCart();
            
        });
    });
    
}


function refreshCart(){
    const cartTag = document.getElementById("cart");
    const cartTotal = document.getElementById("totalSpan");
    //Resets the total
    total = 0;
    added = cartItems.length;
    const items = document.getElementById("cartItems");
    items.innerHTML = "";
    let itemDiv = document.createElement("div");
    // Recalculates the total of the cart
    cartItems.forEach((item)=>{
        const product = catalogoCompleto.find(producto => producto.id === item.id);
        const precio = Number.parseFloat(product.precio);
        currentItem = catalogoCompleto.find((p) => p.id===item.id);
        total = Number.parseFloat(total) + Number.parseFloat(item.quantity)*precio;
        itemDiv = document.createElement("div");
        
        itemDiv.innerHTML = `
        <div class="cartItem" style="">
            <div style="display: inline; margin-right:10px;"><img src="../img/products/${currentItem.imagen}"></div>
            <span style="flex-grow: 1; padding-right: 15px;">${currentItem.id}</span>
            <span style="text-align: right;">$${currentItem.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x${item.quantity}</span>
            <span><button class="cartDeleteButton" style=""><img style="width: 30px; height:30px" src="../img/red-x-icon.png"></button></span>
        </div>
        `;

        var deleteButton = itemDiv.querySelector('.cartDeleteButton');

        // Add event listener to the delete button
        deleteButton.addEventListener('click', function() {
            event.stopPropagation();
            // Get the parent div of the delete button, which is the cartItem div
            var cartItemDiv = deleteButton.closest('.cartItem');
            // Get the span containing the currentItem.id
            var idSpan = cartItemDiv.querySelector('span:nth-child(2)'); 
            
            // Removes it based on the ID of the row
            removeById(idSpan.textContent);
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
    
    localStorage.setItem("cart",JSON.stringify(cartItems));
    cartTotal.textContent = "$"+ total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    cartTag.textContent = added;
}
// Filtra los productos basados en tipo, autor o id
function filtrar(filter) {
    const lowerCaseFilter = filter.toLowerCase(); 
    const filteredItems = catalogoCompleto.filter(item => {
        const lowerCaseId = item.id.toLowerCase(); 
        const lowerCaseAutor = item.autor.toLowerCase(); 
        const lowerCaseTipo = item.tipo.toLowerCase(); 
        return (filter==="" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter)) && (tipoFiltro === "all" || lowerCaseTipo === tipoFiltro.toLowerCase());
    });

    cargarProductos(filteredItems);
}

// Verifies the user is Admin
function isAdmin(userId) {
    return users.some(user => user.id === userId && user.type == "A");
}

function addUserOptions(userId){
    const userOptionsDiv = document.getElementById("userOptions");
    if(isAdmin(userId))
    {
        userOptionsDiv.innerHTML = "<a class=\"dropdown-item\" href=\"#\"><span>Catálogo</span></a>"+
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
    img.src = '../img/products/' + currentItem.imagen;
    imgDiv.appendChild(img);
    cartItemDiv.appendChild(imgDiv);

    // Create the span elements
    var idSpan = document.createElement('span');
    idSpan.style.flexGrow = '1';
    idSpan.style.paddingRight = '15px';
    idSpan.textContent = currentItem.id;
    cartItemDiv.appendChild(idSpan);

    var priceSpan = document.createElement('span');
    priceSpan.style.textAlign = 'right';
    priceSpan.textContent = '$' + currentItem.precio + 'x' + item.quantity;
    cartItemDiv.appendChild(priceSpan);

    // Create the delete button
    var deleteButton = document.createElement('button');
    deleteButton.className = 'cartDeleteButton';
    deleteButton.style.border = '0px';
    deleteButton.style.backgroundColor = 'transparent';
    deleteButton.addEventListener('click', function() {
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


function removeById(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart",JSON.stringify(cartItems));
    }
};