document.addEventListener("DOMContentLoaded", function () {
	loadCart();
});

logged = localStorage.getItem("logged");
    if (!logged)
        window.location.href = "../index.html";

function loadCart() {
    let subTotal = 0;
    const cartTable = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    //Elimina las filas de la tabla
    cartTable.innerHTML = "";

        // Recorrer los envíos y agregar filas a la tabla
    items.forEach((item) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img class="cartImg" src="../img/products/${item.image}"></td>
            <td>${item.id}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>$${(item.price*item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        cartTable.appendChild(fila);
        subTotal = subTotal + Number.parseFloat(item.price) * Number.parseFloat(item.quantity);
    });
    localStorage.removeItem("cart");
    let prodLabel = "producto";
        if(items.length>1)
            prodLabel = "productos";
    const subtotalTag = document.getElementById("subTotal");
    subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + items.length + " "+prodLabel+"): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
    
}