document.addEventListener("DOMContentLoaded", function () {
	cargarCarrito();
    localStorage.clear();
});


function cargarCarrito() {
    let subTotal = 0;
    const tablaCarrito = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    //Elimina las filas de la tabla
    tablaCarrito.innerHTML = "";

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