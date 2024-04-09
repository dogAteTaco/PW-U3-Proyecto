const searchButton = document.getElementById("searchbutton");
const searchBar = document.getElementById("searchbar");
const allItems = document.getElementById("allItems");
const cdItems = document.getElementById("cdItems");
const bookItems = document.getElementById("bookItems");
const catButton = document.getElementById("categoriesButton");
var tipoFiltro = "all";
document.addEventListener("DOMContentLoaded", function () {
    localStorage.setItem("filter", "");
    localStorage.setItem("tipo","");
    cargarCarrito();


    botonBorrar.addEventListener("click", function (event) {
        event.preventDefault();
        //Limpia el local storage
        localStorage.clear();
        //Ejecuta la carga de los resultados de nuevo
        cargarCarrito();
    });

    botonPagar.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = 'payment.html';
    });

    allItems.addEventListener("click", function () {
        tipoFiltro = "all";
        filtrar();
    });

    cdItems.addEventListener("click", function () {
        tipoFiltro = "cd";
        filtrar();
    });

    bookItems.addEventListener("click", function () {
        tipoFiltro = "book";
        filtrar();
    });

    searchButton.addEventListener("click", function () {
        filtrar();
    });

    searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filtrar();
        }
    });
});

function cargarCarrito() {
    let subTotal = 0;
    const tablaCarrito = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    //Elimina las filas de la tabla
    tablaCarrito.innerHTML = "";

    if(items.length==0)
    {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
        +"<center><a href=\"index.html\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else{
        // Recorrer los envíos y agregar filas a la tabla
    items.forEach((item) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img class="cartImg" src="img/products/${item.image}"></td>
            <td>${item.id}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}.00</td>
            <td>$${item.price*item.quantity}.00</td>
        `;
        tablaCarrito.appendChild(fila);
        subTotal = subTotal + Number.parseInt(item.price) * Number.parseInt(item.quantity);
    });

    const subtotalTag = document.getElementById("subTotal");
    subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + items.length + " productos): <b>$" + subTotal + ".00 USD</b></span>";
    }
    
}

// Filtra los productos basados en tipo, autor o id
function filtrar() {
    localStorage.setItem("filter", searchBar.value);
    localStorage.setItem("tipo",tipoFiltro);
}