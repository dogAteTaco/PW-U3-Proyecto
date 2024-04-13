let imageShown;
let imageURL;
let completeCatalog;
let productsArea;
let searchBar;

document.addEventListener("DOMContentLoaded", function () {
    searchBar = document.getElementById("searchbar");
	productsArea = document.getElementById("productsArea");
	
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
			<div name="${currentItem.id}" class="card">
			<div class="card-body">
				<table class="table">
					<tbody>
						<tr>
							<td class="coverSection"><img class="imageShown" src="${imageURL}"></th>
							<td>
								<div>
									<span>Nombre de Producto</span>
									<input class="nameField form-control" type="text" placeholder="Nombre de Producto" value="${currentItem.name}">
								</div>
								<div>
									<span>Autor o Artista</span>
									<input class="authorField form-control" type="text" placeholder="Autor o Artista" value="${currentItem.author}">
									
								</div>
								<div>
									<span>Imagen</span>
									<input class="imageField form-control" type="text" placeholder="URL de imagen" value="${currentItem.image}">
								</div>
								<div>
									<span>Precio</span>
									<input class="priceField form-control" type="number" step="any" placeholder="Precio" value="${currentItem.price}">
								</div>
								<div>
									<div class="dropdown">
										<span>Tipo</span>
										<button class="typeButton btn btn-secondary dropdown-toggle" type="button"
											data-bs-toggle="dropdown" aria-expanded="false">${typeLabel}</button>
										<ul class="typeMenu dropdown-menu">
											<li><a class="typeAlbum dropdown-item" href="#">Álbum</a></li>
											<li><a class="typeBook dropdown-item" href="#">Libro</a></li>
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

	
	const deleteButtons = document.querySelectorAll('.deleteButton.btn.btn-danger');
	deleteButtons.forEach(deleteButton => {
		deleteButton.addEventListener('click', function(event) {
				event.stopPropagation();
				// Get the closest card item (it's corresponding card)
				var card = deleteButton.closest('.card');
				card.outerHTML = "";
				removeItem(card.getAttribute('name'));
		});
	});

	const saveButtons = document.querySelectorAll('.saveButton.btn.btn-primary');
	saveButtons.forEach(saveButton => {
		saveButton.addEventListener('click', function(event) {
				event.stopPropagation();
				// Get the closest card item (it's corresponding card)
				var card = saveButton.closest('.card');
				// Removes background showing that values have changed if there were unsavedchanges
				card.style.backgroundColor = 'transparent';
				//Gets all the fields
				var id = card.getAttribute('name');
				var name = card.querySelector('.nameField').value;
				var author = card.querySelector('.authorField').value;
				var image = card.querySelector('.imageField').value;
				var price = card.querySelector('.priceField').value;
				var type = card.querySelector('.typeButton.btn.btn-secondary.dropdown-toggle').innerText.trim();
				if(type=="Libro")
					type = "Book";
				else
					type = "CD";

				updateItem(id,name,author,price,image,type);
		});
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
			imgElement.src = imageURL;
		});
	});

	const albumCatButtons = document.querySelectorAll('.typeAlbum.dropdown-item');
	albumCatButtons.forEach(albumButton => {
		albumButton.addEventListener('click', function() {
				// Get the closest card item (it's corresponding card)
				var category = albumButton.closest('.dropdown').querySelector('.typeButton.btn.btn-secondary.dropdown-toggle');
				category.innerText = albumButton.innerText;
				var card = albumButton.closest('.card');
				card.style.backgroundColor = '#f7d800';
		});
	});

	const bookCatButtons = document.querySelectorAll('.typeBook.dropdown-item');
	bookCatButtons.forEach(bookButton => {
		bookButton.addEventListener('click', function() {
				// Get the closest card item (it's corresponding card)
				var category = bookButton.closest('.dropdown').querySelector('.typeButton.btn.btn-secondary.dropdown-toggle');
				category.innerText = bookButton.innerText;
				var card = bookButton.closest('.card');
				card.style.backgroundColor = '#f7d800';
		});
	});

	//Detect value changes in the fields
	var elements = document.querySelectorAll('.nameField, .authorField, .imageField, .priceField');
	elements.forEach(field => {
		field.addEventListener('input', function() {
			var card = field.closest('.card');
			card.style.backgroundColor = '#f7d800';
		});
	});
}

// Filtra los productos basados en tipo, author o nombre
function filterProducts(filter) {
    const lowerCaseFilter = filter.toLowerCase(); 
    const filteredItems = completeCatalog.filter(item => {
        const lowerCaseId = item.name.toLowerCase(); 
        const lowerCaseAutor = item.author.toLowerCase(); 
        return (filter==="" || lowerCaseId.includes(lowerCaseFilter) || lowerCaseAutor.includes(lowerCaseFilter));
    });

    loadProducts(filteredItems);
}

function removeItem(productId)
{
	completeCatalog = completeCatalog.filter(item => item.id !== productId);
	refreshStorage();
}

function updateItem(id,name,author,price,image,type)
{
	completeCatalog.forEach(item => {
		if (item.id === id) {
			item.name = name;
			item.author = author;
			item.price = price;
			item.image = image;
			item.type = type;
		}
	});
	refreshStorage();
}

function refreshStorage()
{
	const catalogJSON = JSON.stringify(completeCatalog);
    localStorage.setItem("catalog", catalogJSON);
}
