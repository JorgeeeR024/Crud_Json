const form = document.getElementById('item-form');
const id = document.getElementById('item-id');
const name = document.getElementById('name');
const desc = document.getElementById('description');
const list = document.getElementById('items-list');
const url = 'api.php';

function cargar() {
    fetch(url).then(r => r.json()).then(data => {
        list.innerHTML = '';
        data.forEach(i => {
            list.innerHTML += `
                <li><b>${i.name}</b>: ${i.description}<br>
                <button onclick="edit(${i.id})">Editar</button>
                <button onclick="del(${i.id})">Eliminar</button></li>`;
        });
    });
}

form.onsubmit = e => {
    e.preventDefault();
    const item = { name: name.value, description: desc.value };
    const metodo = id.value ? 'PUT' : 'POST';
    if (id.value) item.id = parseInt(id.value);

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    }).then(() => {
        form.reset();
        cargar();
    });
};

function edit(i) {
    fetch(`${url}?id=${i}`).then(r => r.json()).then(d => {
        id.value = d.id;
        name.value = d.name;
        desc.value = d.description;
    });
}

function del(i) {
    if (confirm('¿Eliminar?')) {
        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${i}`
        }).then(() => cargar());
    }
}

cargar();
