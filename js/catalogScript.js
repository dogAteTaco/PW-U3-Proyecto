let imageShown;
let imageURL;
let completeCatalog;
let productsArea;
let searchBar;

document.addEventListener("DOMContentLoaded", function () {
    searchBar = document.getElementById("searchbar");
    imageShown = document.getElementsByClassName("imageShown")[0];
	imageURL = document.getElementsByClassName("imageField")[0];
	productsArea = document.getElementById("productsArea");
	
	imageURL.addEventListener("input", function(event){
		if(imageURL.value.toLowerCase().startsWith("http"))
			imageShown.src = imageURL.value;
		else
			imageShown.src = "../img/products/"+imageURL.value;	
	});
	const catalogJSON = localStorage.getItem("catalog");

    if(catalogJSON)
        completeCatalog = JSON.parse(catalogJSON);
	
	loadProducts(completeCatalog);

	searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filterProducts(searchBar.value);
        }
    });
});


function loadProducts(products)
{
	productsArea = document.getElementById("productsArea");
	productsArea.innerHTML = "";
	products.forEach((currentItem) => {
		let imageURL = currentItem.image;
        if(!currentItem.image.toLowerCase().startsWith("http"))
			imageURL = "../img/products/"+currentItem.image;

		let typeLabel = "Álbum";
		if(currentItem.type=="Book")
			typeLabel = "Libro";
		let newItemDiv = document.createElement("div");
		newItemDiv.innerHTML = `
			<div class="card">
			<div class="card-body">
				<table class="table">
					<tbody>
						<tr>
							<td class="coverSection"><img class="imageShown" src="${imageURL}"></th>
							<td>
								<div>
									<span>Nombre de Producto</span>
									<input class="nameField" type="text" class="form-control" placeholder="Nombre de Producto" value="${currentItem.name}">
								</div>
								<div>
									<span>Autor o Artista</span>
									<input class="authorField" type="text" class="form-control" placeholder="Autor o Artista" value="${currentItem.autor}">
									
								</div>
								<div>
									<span>Imagen</span>
									<input class="imageField" type="text" class="form-control" placeholder="URL de imagen" value="${currentItem.image}">
								</div>
								<div>
									<div class="dropdown">
										<span>Tipo</span>
										<button class="typeButton btn btn-secondary dropdown-toggle" type="button"
											data-bs-toggle="dropdown" aria-expanded="false">
											${typeLabel}
										</button>
										<ul class="typeMenu dropdown-menu">
											<li><a class="typeAdmin dropdown-item" href="#">Álbum</a></li>
											<li><a class="typeClient dropdown-item" href="#">Libro</a></li>
										</ul>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="productCatalogButtons">
				<button class="saveButton btn btn-primary">Guardar</button>
				<button class="deleteButton btn btn-danger">Borrar</button>
				</div>
			</div>
		</div>
		`;
		productsArea.appendChild(newItemDiv);
	});

	const imageFieldInputs = document.querySelectorAll('.imageField');

	// Loop through each input field and add an event listener
	imageFieldInputs.forEach(input => {
		input.addEventListener('input', function() {
			// Get the value entered in the input field
			let imageURL = input.value;
			if(!input.value.toLowerCase().startsWith("http"))
				imageURL = "../img/products/"+input.value;

			const imgElement = input.closest('.card').querySelector('.imageShown');
			console.log(imageURL);
			imgElement.src = imageURL;
		});
	});
}

// Filtra los productos basados en tipo, autor o nombre
function filterProducts(filter) {
    const lowerCaseFilter = filter.toLowerCase(); 
    const filteredItems = completeCatalog.filter(item => {
        const lowerCaseId = item.name.toLowerCase(); 
        const lowerCaseAutor = item.autor.toLowerCase(); 
        return (filter==="" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter));
    });

    loadProducts(filteredItems);
}