const logged = localStorage.getItem("logged");
    if (!logged)
        window.location.href = "../index.html";
const items = JSON.parse(localStorage.getItem("cart")) || [];
    
    if(items.length==0)
        window.location.href = "landing.html";  
    
document.addEventListener("DOMContentLoaded", function () {
	loadCart();
});



function loadCart() {
    let subTotal = 0;
    const cartTable = document.getElementById("tablaCarrito");
    // Obtener los envíos almacenados en el almacenamiento local
    
    //Elimina las filas de la tabla
    cartTable.innerHTML = "";

        // Recorrer los envíos y agregar filas a la tabla
    items.forEach((currentItem) => {
        const fila = document.createElement("tr");
        let imageURL = currentItem.image;
        if(!currentItem.image.toLowerCase().startsWith("http"))
			imageURL = "../img/products/"+currentItem.image;

        fila.innerHTML = `
            <td><img class="cartImg" src="${imageURL}"></td>
            <td>${currentItem.name}</td>
            <td>${currentItem.quantity}</td>
            <td>$${currentItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>$${(currentItem.price*currentItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        cartTable.appendChild(fila);
        subTotal = subTotal + Number.parseFloat(currentItem.price) * Number.parseFloat(currentItem.quantity);
    });
    localStorage.removeItem("cart");
    let prodLabel = "producto";
        if(items.length>1)
            prodLabel = "productos";
    const subtotalTag = document.getElementById("subTotal");
    subtotalTag.innerHTML = "<span style=\"font-size: x-large;\"> Total (" + items.length + " "+prodLabel+"): <b>$" + subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD</b></span>";
    
}