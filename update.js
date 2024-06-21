let companyName = document.getElementById('companyName');
let contactName = document.getElementById('contactName');
let contactTitle = document.getElementById('contactTitle');
let street = document.getElementById('street');
let city = document.getElementById('city');
let country = document.getElementById('country');
let updateForm = document.getElementById('updateForm');


let urlParams = new URLSearchParams(window.location.search);
let supplierId = urlParams.get('id');

async function getSupplier(id) {
    const response = await fetch(`https://northwind.vercel.app/api/suppliers/${id}`);
    const supplier = await response.json();
    fillUpdateForm(supplier);
}

function fillUpdateForm(data) {
    companyName.value = data.companyName;
    contactName.value = data.contactName;
    contactTitle.value = data.contactTitle;
    street.value = data.address.street;
    city.value = data.address.city;
    country.value = data.address.country;
}

updateForm.addEventListener('click', (e) => {
    e.preventDefault();
    updateSupplier(supplierId);
});

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

    const response = await fetch(`https://northwind.vercel.app/api/suppliers/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        alert('Supplier updated successfully!');
        window.location.href = "index.html";
    } else {
        alert('Failed to update supplier.');
    }
}

getSupplier(supplierId);