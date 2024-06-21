let tbody = document.querySelector("tbody");
let companyName = document.getElementById('companyName');
let contactName = document.getElementById('contactName');
let contactTitle = document.getElementById('contactTitle');
let street = document.getElementById('street');
let city = document.getElementById('city');
let country = document.getElementById('country');
let createBtn = document.getElementById('createBtn');
let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
let searchInput = document.querySelector("#searchInput");

let suppliersData = [];

async function getSuppliers() {
    const response = await fetch("https://northwind.vercel.app/api/suppliers");
    suppliersData = await response.json();
    generateTable(suppliersData);
}

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredSuppliers = suppliersData.filter(supplier =>
        supplier.companyName.toLowerCase().includes(query)
    );
    generateTable(filteredSuppliers);
});

function generateTableRow(data) {
    let tableRow = document.createElement("tr");
    tableRow.setAttribute("data-id", data.id);

    let id = document.createElement("td");
    id.textContent = data.id;

    let companyName = document.createElement("td");
    companyName.textContent = data.companyName;

    let contactName = document.createElement("td");
    contactName.textContent = data.contactName;

    let contactTitle = document.createElement("td");
    contactTitle.textContent = data.contactTitle;

    let street = document.createElement("td");
    street.textContent = data.address.street;

    let city = document.createElement("td");
    city.textContent = data.address.city;

    let country = document.createElement("td");
    country.textContent = data.address.country;

    let actions = document.createElement("td");
    actions.style.display = "flex";
    actions.style.gap = "10px";
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger");

    let updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.classList.add("btn", "btn-warning", "text-light");

    actions.append(deleteBtn, updateBtn);
    tableRow.append(id, companyName, contactName, contactTitle, street, city, country, actions);

    deleteBtn.addEventListener("click", () => {
        if (window.confirm("Are you sure delete this item?")) {
            deleteSupplier(data.id);
            deleteBtn.parentElement.parentElement.remove();
        }
    });

    updateBtn.addEventListener("click", () => {
        window.location.href = `update.html?id=${data.id}`;
        fillUpdateForm(data);
    });

    return tableRow;
}

async function generateTable(suppliers) {
    tbody.innerHTML = '';
    suppliers.map(singleSupplier => {
        tbody.append(generateTableRow(singleSupplier));
    });
}

async function deleteSupplier(id) {
    await fetch(`https://northwind.vercel.app/api/suppliers/${id}`, {
        method: "DELETE",
    });
}

createBtn.addEventListener("click", () => {
    if (createBtn.dataset.id) {
        updateSupplier(createBtn.dataset.id);
    } else {
        postSupplier();
    }
});

async function postSupplier() {
    let data = {
        companyName: companyName.value,
        contactName: contactName.value,
        contactTitle: contactTitle.value,
        address: {
            street: street.value,
            city: city.value,
            country: country.value
        }
    };
    const res = await fetch("https://northwind.vercel.app/api/suppliers", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert('Supplier added successfully!');
        getSuppliers();
        clearForm();
    } else {
        alert('Failed to add supplier.');
    }
}

async function updateSupplier(id) {
    let data = {
        companyName: companyName.value,
        contactName: contactName.value,
        contactTitle: contactTitle.value,
        address: {
            street: street.value,
            city: city.value,
            country: country.value
        }
    };

    const res = await fetch(`https://northwind.vercel.app/api/suppliers/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert('Supplier updated successfully!');
        getSuppliers();
        clearForm();
        modal.hide();
        createBtn.textContent = "Create";
        delete createBtn.dataset.id;
    } else {
        alert('Failed to update supplier.');
    }
}

function fillUpdateForm(data) {
    companyName.value = data.companyName;
    contactName.value = data.contactName;
    contactTitle.value = data.contactTitle;
    street.value = data.address.street;
    city.value = data.address.city;
    country.value = data.address.country;

    createBtn.textContent = "Update";
    createBtn.dataset.id = data.id;
    modal.show();
}

function clearForm() {
    companyName.value = '';
    contactName.value = '';
    contactTitle.value = '';
    street.value = '';
    city.value = '';
    country.value = '';

    createBtn.textContent = "Create";
    delete createBtn.dataset.id;
}

getSuppliers();
