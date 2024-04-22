document.addEventListener("DOMContentLoaded", function() {
    // Obtener nombre del Local Storage
    const nombreGuardado = localStorage.getItem("nombre");
    if (nombreGuardado) {
        bienvenida.textContent = `Bienvenido/a, ${nombreGuardado}!`;
        nombreFormContainer.style.display = "none";
        agendasContainer.style.display = "flex";
        carritoContainer.style.display = "block";
    }

    // Mostrar las agendas disponibles al cargar la página
    mostrarAgendas();

    // Cargar carrito desde Local Storage si existe
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
});

// Elementos del DOM
const agendasContainer = document.getElementById("agendas");
const carritoContainer = document.getElementById("carrito");
const carritoLista = document.getElementById("carrito-lista");
const totalElement = document.getElementById("total");
const aceptarCompraBtn = document.getElementById("aceptar-compra");
const mensajeFinal = document.getElementById("mensaje-final");
const nombreForm = document.getElementById("nombre-form");
const nombreFormContainer = document.getElementById("nombre-form-container");
const bienvenida = document.getElementById("bienvenida");

// Agendas disponibles
const agendas = [
    { id: 1, nombre: "Agenda 2024", precio: 15000, imagen: "./imagenes/agenda.png" },
    { id: 2, nombre: "Agenda Ejecutiva", precio: 20000, imagen: "./imagenes/agendaejecutiva.png" },
    { id: 3, nombre: "Agenda de Lujo", precio: 30000, imagen: "./imagenes/agendadelujo.png" }
];

// Carrito de compras
let carrito = [];

// Mostrar agendas disponibles en el DOM
function mostrarAgendas() {
    agendasContainer.innerHTML = "";
    agendas.forEach(agenda => {
        const agendaDiv = document.createElement("div");
        agendaDiv.classList.add("agenda");
        agendaDiv.innerHTML = `
            <div class="agenda-info">
                <img src="${agenda.imagen}" alt="${agenda.nombre}">
                <p class="agenda-nombre">${agenda.nombre}</p>
                <p>Precio: $${agenda.precio}</p>
                <button class="agregar-carrito" data-id="${agenda.id}">Agregar al Carrito</button>
            </div>
        `;
        agendasContainer.appendChild(agendaDiv);
    });
}

// Agregar una agenda al carrito de compras
function agregarAlCarrito(id) {
    const agendaEnCarrito = carrito.find(agenda => agenda.id === id);
    const agenda = agendas.find(item => item.id === id);

    if (agenda && agendaEnCarrito) {
        agendaEnCarrito.cantidad++;
    } else if (agenda) {
        carrito.push({ ...agenda, cantidad: 1 });
    }

    actualizarCarrito();
}

// Eliminar un elemento del carrito
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(agenda => agenda.id === id);
    if (index !== -1) {
        const agenda = carrito[index];
        agenda.cantidad--;
        if (agenda.cantidad === 0) {
            carrito.splice(index, 1);
        }
        // Incrementar el stock
        const agendaDisponible = agendas.find(agenda => agenda.id === id);
        if (agendaDisponible) {
            agendaDisponible.stock++;
        }
        actualizarCarrito();
        mostrarAgendas();
    }
}

// Actualizar el carrito en el DOM y en localStorage
function actualizarCarrito() {
    carritoLista.innerHTML = "";
    let total = 0;
    carrito.forEach(agenda => {
        const li = document.createElement("li");
        li.textContent = `${agenda.nombre} x ${agenda.cantidad} - Total: $${agenda.precio * agenda.cantidad}`;
        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.addEventListener("click", () => {
            eliminarDelCarrito(agenda.id);
        });
        li.appendChild(eliminarBtn);
        carritoLista.appendChild(li);
        total += agenda.precio * agenda.cantidad;
    });
    totalElement.textContent = total;
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar en localStorage
}

// Aceptar la compra
aceptarCompraBtn.addEventListener("click", function() {
    const totalPagar = totalElement.textContent;
    if (totalPagar === "0") {
        const mensaje = document.createElement("p");
        mensaje.textContent = `No has realizado ninguna compra.`;
        mensajeFinal.innerHTML = "";
        mensajeFinal.appendChild(mensaje);
    } else {
        const mensaje = document.createElement("p");
        mensaje.textContent = `El total a pagar es: $${totalPagar}`;
        mensajeFinal.innerHTML = "";
        mensajeFinal.appendChild(mensaje);
        carrito = []; // Vaciar carrito
        actualizarCarrito();
    }
});

// Al enviar el formulario de nombre
nombreForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario
    const nombreInput = document.getElementById("nombre");
    const nombre = nombreInput.value.trim();
    if (nombre !== "") {
        bienvenida.textContent = `Bienvenido/a, ${nombre}!`;
        nombreFormContainer.style.display = "none"; // Ocultar formulario de nombre
        agendasContainer.style.display = "flex"; // Mostrar agendas
        carritoContainer.style.display = "block"; // Mostrar carrito
        localStorage.setItem("nombre", nombre); // Guardar nombre en Local Storage
    }
});

// Agregar al carrito
agendasContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("agregar-carrito")) {
        const id = parseInt(event.target.getAttribute("data-id"));
        agregarAlCarrito(id);
    }
});

