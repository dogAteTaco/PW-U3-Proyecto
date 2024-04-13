let completeCatalog;
let nameField;
let authorField;
let priceField;
let users;
class User {
    constructor(name, password, type) {
        this.name = name;
        this.password = password;
        this.type = type;
    }
}


document.addEventListener("DOMContentLoaded", function () {
	console.log(localStorage.getItem("users"));
	if (!localStorage.getItem("logged"))
    	window.location.href = "../index.html";
	users = JSON.parse(localStorage.getItem("users")).map(item => new User(item.id, item.password, item.type));
	console.log(users);
	// Verifies the user is Admin
	if(!isAdmin(localStorage.getItem("user")))
	{
		window.location.href = "../index.html";
	}

	let saveButton = document.getElementById("saveButton");
	let nameField = document.getElementById("nameField");
	let authorField = document.getElementById("authorField");
	let priceField = document.getElementById("priceField");
	let typeButton = document.getElementById("typeButton");
	let imageField = document.getElementById("imageField");
	let imageShown = document.getElementById("imageShown");
	
	imageField.addEventListener("input", function(event){
		if(imageField.value.toLowerCase().startsWith("http"))
			imageShown.src = imageField.value;
		else
			imageShown.src = "../img/products/"+imageField.value;	
	});

	const catalogJSON = localStorage.getItem("catalog");

    if(catalogJSON)
        completeCatalog = JSON.parse(catalogJSON);
	
	saveButton.addEventListener('click', function(event) {
		event.stopPropagation();
		// Get the closest card item (it's corresponding card)
		var card = saveButton.closest('.card');
		// Removes background showing that values have changed if there were unsavedchanges
		card.style.backgroundColor = 'transparent';


		//Gets all the fields
		var id = parseInt(completeCatalog[completeCatalog.length-1].id)+1;
		
		var name = nameField.value;
		var author = authorField.value;
		var price = priceField.value;
		var type = typeButton.innerText;
		var image = imageField.value;

		if(type=="Libro")
			type = "Book";
		else
			type = "CD";
		
		addItem(id,name,author,price,image,type);
		window.location.href = "catalog.html";
	});

	imageField.addEventListener('input', function() {
		// Get the value entered in the input field
		let imageURL = imageField.value;
		if(!imageField.value.toLowerCase().startsWith("http"))
			imageURL = "../img/products/"+imageField.value;
		imageShown.src = imageURL;
	});
});


function addItem(id,name,author,price,image,type)
{
	var newItem = {
		id: id,
		name: name,
		author: author,
		price: price,
		image: image,
		type: type
	};

	console.log(newItem);
	completeCatalog.push(newItem);
	refreshStorage();
}

function refreshStorage()
{
	const catalogJSON = JSON.stringify(completeCatalog);
    localStorage.setItem("catalog", catalogJSON);
}

function isAdmin(userId) {
	console.log("verificaAdmin");
	return users.some(user => user.name === userId && user.type == "A");
}