// Teste se o browser possuir Service Worker e se possui, registramos o nosso
if("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").then(registration => {
		console.log("SW Registered!");
		console.log(registration);
	}).catch(error => {
		console.log("SW Registered Failed!");
		console.log(error);
	});
}

// Inicializando a lista de compra
let items = [];

// Iniciliazando a aplicação, buscando os itens já salvos e passando função para os formularios
onload = () => {
  const itemsJson = JSON.parse(localStorage.getItem("items"));
  if (itemsJson) items = itemsJson;
	loadItems();
  
	document.querySelector("#addItemForm").onsubmit = (event) => {
    event.preventDefault();
		addItem();
		loadItems();
		saveItems();
  };
  
	document.querySelector("#editItemForm").onsubmit = (event) => {
    event.preventDefault();
		editItem();
		loadItems();
		saveItems();
  };
};

// Gera um id unico
const uid = () => {
  return `_${Math.random().toString(16).slice(2)}`;
};

// Carrega a lista de compra na tela
const loadItems = () => {
  const itemsList = document.querySelector("#itemsList");
  itemsList.innerHTML = "";
  items.forEach((item) => {
    createItemElement(item, itemsList)
  });
	
  if (items.length > 0) {
    itemsList.classList.remove("hidden");
    document.querySelector("#blank").classList.add("hidden");
  } else {
    itemsList.classList.add("hidden");
    document.querySelector("#blank").classList.remove("hidden");
  }
};

// Salva a lista de compra no localStorage
const saveItems = () => {
	localStorage.setItem('items', JSON.stringify(items));
};

// Adiciona um novo item na lista de compra
const addItem = () => {
	const input = document.querySelector("#itemInput");
	const description = input.value.trim();
	if (description === "")
		return;
	
	items.push({
		id: uid(),
		purchased: false,
		description: description
	});
	input.value = "";
};

// Remove um item da lista de compra
const deleteItem = (event) => {
	const id = event.target.dataset.id;
	items = items.filter((item) => item.id != id);
	loadItems();
	saveItems();
};

// Compra um item da lista de compra
const buyItem = (event) => {
	const id = event.target.dataset.id;
	const itemIndex = items.findIndex((item) => item.id === id);
	items[itemIndex].purchased = true;
};

// Edita a descrição de um item da lista de compra
const editItem = () => {
	const input = document.querySelector("#itemEditInput");
	const description = input.value.trim();
	if (description === "") {
		showPage("homePage");
		return;
	}
	
	const id = input.dataset.id;
	const itemIndex = items.findIndex((item) => item.id === id);
	items[itemIndex].description = description;
	input.value = "";
  input.removeAttribute("data-id");
};

// Carrega a pagina selecionada e esconde a outras
const showPage = (page) => {
  const pageList = document.querySelectorAll("body > .container");
  pageList.forEach((page) => page.classList.add("hidden"));
  document.querySelector(`#${page}`).classList.remove("hidden");
};

// Carrega a tela de edição com o valor do item selecionado
const loadEditPage = (event) => {
	const id = event.target.dataset.id;
	const itemIndex = items.findIndex((item) => item.id === id);
	const input = document.querySelector("#itemEditInput");
	const item = items[itemIndex];
	input.value = item.description;
	input.setAttribute("data-id", item.id);
	showPage("editPage");
	input.focus();
};

// Cria um novo item na lista de compra
const createItemElement = (item, itemsList) => {
	let elemItem = document.createElement("div");
	elemItem.classList.add("item-row");
	if(item.purchased) elemItem.classList.add("complete");
	
	let elemItemDescription = document.createElement("div");
	elemItemDescription.innerHTML = item.description;
	
	let elemItemButtons = document.createElement("div");
	elemItemButtons.classList.add("item-buttons");
	
	let elemItemEditButtom = document.createElement("div");
	elemItemEditButtom.classList.add("white");
	elemItemEditButtom.classList.add("edit-icon");
	elemItemEditButtom.setAttribute("data-id", item.id);
	elemItemEditButtom.onclick = loadEditPage;

	let elemItemShoppingButtom = document.createElement("div");
	elemItemShoppingButtom.classList.add("white");
	elemItemShoppingButtom.classList.add("shopping-icon");
	elemItemShoppingButtom.setAttribute("data-id", item.id);
	elemItemShoppingButtom.onclick = (event) => {
		buyItem(event);
		loadItems();
		saveItems();
	};
	
	let elemItemDeleteButtom = document.createElement("div");
	elemItemDeleteButtom.classList.add("white");
	elemItemDeleteButtom.classList.add("delete-icon");
	elemItemDeleteButtom.setAttribute("data-id", item.id);
	elemItemDeleteButtom.onclick = (event) => {
		deleteItem(event);
		showPage("homePage");
		loadItems();
		saveItems();
	};
	
	elemItemButtons.appendChild(elemItemEditButtom);
	elemItemButtons.appendChild(elemItemShoppingButtom);
	elemItemButtons.appendChild(elemItemDeleteButtom);
	elemItem.appendChild(elemItemDescription);
	elemItem.appendChild(elemItemButtons);
  itemsList.appendChild(elemItem);
};