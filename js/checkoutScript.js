let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
var tipoFiltro = "all";

logged = localStorage.getItem("logged");
if (!logged)
    window.location.href = "../index.html";

document.addEventListener("DOMContentLoaded", function () {

    localStorage.setItem("filter", "");
    localStorage.setItem("tipo", "");
    reloadCart();


    botonBorrar.addEventListener("click", function (event) {
        event.preventDefault();
        //Limpia el local storage

        //Ejecuta la carga de los resultados de nuevo
        reloadCart();
    });

    botonPagar.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = 'ticket.html';
    });

});

function reloadCart() {
    const cartTable = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
    cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    //Elimina las filas de la tabla
    cartTable.innerHTML = "";

    if (cartItems.length == 0) {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
            + "<center><a href=\"landing.html\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else {
        // Recorrer los envíos y agregar filas a la tabla
        cartItems.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td><img class="cartImg" src="../img/products/${item.image}"></td>
            <td>${item.id}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>$${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><button class="cartDeleteButton"><img style="" src="../img/red-x-icon.png"></button></td>
        `;


            var deleteButton = row.querySelector('.cartDeleteButton');

            // Add event listener to the delete button
            deleteButton.addEventListener('click', function () {
                // Get the parent tr of the delete button, which is the table row
                var cartItemRow = deleteButton.closest('tr');
                // Get the td containing the item id
                var idTd = cartItemRow.querySelector('td:nth-child(2)');

                // Removes the item based on its ID
                removeById(idTd.innerText);
                console.log(idTd.innerText);
                // Remove the cart item row from the table
                cartItemRow.remove();

                refreshTotal();
            });
            cartTable.appendChild(row);

        });
        refreshTotal();
        
    }

}

function refreshTotal() {
    let subTotal = 0;
    if (cartItems.length == 0) {
        document.getElementById("cartArea").innerHTML = "<div class=\"container\"><h2>Tu carrito esta vacío.</h2>"
            + "<center><a href=\"landing.html\"><button class=\"btn btn-warning mt-2\">Regresar a tienda</button></a></center></div>";
    }
    else {
        // Recorrer los envíos y agregar filas a la tabla
        cartItems.forEach((item) => {


            subTotal = subTotal + Number.parseFloat(item.price) * Number.parseFloat(item.quantity);

        });
        const subtotalTag = document.getElementById("subTotal");
        subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + cartItems.length + " productos): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
    }

}
function removeById(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
};