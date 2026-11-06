
// ==========================================
// CONFIGURACIÓN GENERAL DE ECOMARKET
// ==========================================

const CLAVE_PRODUCTOS = "ecoMarketProductos";
const CLAVE_CARRITO = "ecoMarketCarrito";
const CLAVE_PEDIDO = "ecoMarketUltimoPedido";

let productosTienda = [];
let carrito = [];

const imagenesProducto = {
    1: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=700",
    2: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=700",
    3: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=700",
    4: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700",
    5: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    6: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700",
    7: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700",
    8: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=700",
    9: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=700",
    10: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=700",
    11: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700",
    12: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=700",
    13: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700",
    14: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700",
    15: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700",
    16: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=700",
    17: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700",
    18: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700",
    19: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700",
    20: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700",
    21: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700",
    22: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    23: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=700",
    24: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
    25: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=700",
    26: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=700",
    27: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=700",
    28: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=700",
    29: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700",
    30: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=700",
    31: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=700",
    32: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700",
    33: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=700",
    34: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700",
    35: "https://images.unsplash.com/photo-1547514701-42782101795e?w=700"
};

const formatoPrecio = (valor) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
};

// Imágenes de apoyo según la categoría
function obtenerImagen(producto) {
    if (producto.imagen) {
        return producto.imagen;
    }

    if (imagenesProducto[producto.id]) {
        return imagenesProducto[producto.id];
    }

    const categoria = producto.categoria.toLowerCase();

    if (categoria.includes("frutas")) {
        return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600";
    }

    if (categoria.includes("despensa")) {
        return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600";
    }

    if (categoria.includes("cuidado")) {
        return "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600";
    }

    return "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600";
}

// ==========================================
// CARGAR PRODUCTOS Y CARRITO
// ==========================================

async function iniciarTienda() {
    try {
        const guardados = localStorage.getItem(CLAVE_PRODUCTOS);

        if (guardados) {
            productosTienda = JSON.parse(guardados);
        } else {
            const respuesta = await fetch("data/productos.json");

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo de productos.");
            }

            productosTienda = await respuesta.json();

            localStorage.setItem(
                CLAVE_PRODUCTOS,
                JSON.stringify(productosTienda)
            );
        }

        const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

        actualizarContadorCarrito();

        const pagina = document.body.dataset.page;

        if (pagina === "inicio" || pagina === "catalogo") {
            crearPanelCarrito();
            renderizarPanelCarrito();
        }

        if (pagina === "inicio") {
            mostrarProductosDestacados();
        }

        if (pagina === "catalogo") {
            mostrarCatalogo();
            configurarFiltros();
        }

        if (pagina === "carrito") {
            mostrarCarrito();
        }

        if (pagina === "checkout") {
            mostrarResumenCheckout();
            configurarCheckout();
        }

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los productos. Abre el proyecto con Live Server.");
    }
}

// ==========================================
// GUARDAR INFORMACIÓN
// ==========================================

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarPanelCarrito();
}

function guardarProductosTienda() {
    localStorage.setItem(
        CLAVE_PRODUCTOS,
        JSON.stringify(productosTienda)
    );
}

function actualizarContadorCarrito() {
    const contador = document.querySelector("#contador-carrito");

    if (contador) {
        const cantidad = carrito.reduce(
            (total, item) => total + item.cantidad,
            0
        );

        contador.textContent = cantidad;
    }
}

function mostrarProductosDestacados() {
    const contenedor = document.querySelector("#productos-destacados");

    if (!contenedor) return;

    const destacados = [1, 4, 21]
        .map(id => productosTienda.find(producto => producto.id === id))
        .filter(producto => producto && producto.activo && producto.stock > 0);

    contenedor.innerHTML = "";

    destacados.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "eco-producto";
        tarjeta.innerHTML = `
            <img src="${obtenerImagen(producto)}" alt="${producto.nombre}" loading="lazy">
            <div class="eco-producto-info">
                <span class="eco-producto-categoria">${producto.categoria}</span>
                <h3>${producto.nombre}</h3>
                <p>De ${producto.productor}, ${producto.ciudad}.</p>
                <strong class="eco-producto-precio">${formatoPrecio(producto.precio)}</strong>
                <button type="button" class="eco-boton boton-tienda" data-agregar="${producto.id}">
                    Agregar al carrito
                </button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    contenedor.querySelectorAll("[data-agregar]").forEach(boton => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(Number(boton.dataset.agregar));
        });
    });
}

function crearPanelCarrito() {
    if (document.querySelector("#panel-carrito")) return;

    const overlay = document.createElement("div");
    overlay.className = "eco-carrito-overlay";
    overlay.id = "panel-carrito-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <aside
            class="eco-carrito-panel"
            id="panel-carrito"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-carrito-titulo"
            tabindex="-1"
        >
            <div class="eco-carrito-cabecera">
                <h2 id="panel-carrito-titulo">Tu carrito</h2>
                <button type="button" class="eco-carrito-cerrar" data-cerrar-carrito aria-label="Cerrar carrito">×</button>
            </div>
            <div class="eco-carrito-items" id="panel-carrito-items"></div>
            <div class="eco-carrito-pie">
                <div class="eco-carrito-total">
                    <span>Subtotal</span>
                    <strong id="panel-carrito-subtotal">$0</strong>
                </div>
                <a href="checkout.html" class="eco-boton boton-tienda" id="panel-carrito-checkout">
                    Continuar con la compra
                </a>
                <a href="carrito.html" class="eco-carrito-ver-todo">Ver carrito completo</a>
            </div>
        </aside>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener("click", evento => {
        if (evento.target === overlay || evento.target.closest("[data-cerrar-carrito]")) {
            ocultarPanelCarrito();
        }

        const boton = evento.target.closest("[data-panel-sumar], [data-panel-restar], [data-panel-eliminar]");
        if (!boton) return;

        const id = Number(boton.dataset.panelSumar || boton.dataset.panelRestar || boton.dataset.panelEliminar);

        if (boton.hasAttribute("data-panel-sumar")) {
            cambiarCantidad(id, 1);
        } else if (boton.hasAttribute("data-panel-restar")) {
            cambiarCantidad(id, -1);
        } else {
            eliminarDelCarrito(id);
        }
    });

    document.querySelectorAll("[data-abrir-carrito]").forEach(enlace => {
        enlace.addEventListener("click", evento => {
            evento.preventDefault();
            mostrarPanelCarrito();
        });
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape" && !overlay.hidden) {
            ocultarPanelCarrito();
        }
    });
}

function renderizarPanelCarrito() {
    const contenedor = document.querySelector("#panel-carrito-items");
    const subtotalElemento = document.querySelector("#panel-carrito-subtotal");
    const checkout = document.querySelector("#panel-carrito-checkout");

    if (!contenedor || !subtotalElemento) return;

    const items = carrito
        .map(item => ({
            item,
            producto: productosTienda.find(producto => producto.id === item.id)
        }))
        .filter(({ producto }) => producto);

    const cantidadTotal = items.reduce((total, { item }) => total + item.cantidad, 0);
    const subtotal = items.reduce(
        (total, { item, producto }) => total + producto.precio * item.cantidad,
        0
    );

    if (items.length === 0) {
        contenedor.innerHTML = `
            <div class="eco-carrito-vacio">
                <p>Tu carrito está vacío.</p>
                <p>Agrega productos frescos y sostenibles para comenzar.</p>
            </div>
        `;
    } else {
        contenedor.innerHTML = items.map(({ item, producto }) => `
            <article class="eco-carrito-item">
                <img src="${obtenerImagen(producto)}" alt="${producto.nombre}">
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>${formatoPrecio(producto.precio)} c/u</p>
                    <div class="eco-carrito-item-acciones">
                        <button type="button" data-panel-restar="${producto.id}" aria-label="Restar ${producto.nombre}">−</button>
                        <strong>${item.cantidad}</strong>
                        <button type="button" data-panel-sumar="${producto.id}" aria-label="Agregar ${producto.nombre}">+</button>
                        <button type="button" class="eco-carrito-eliminar" data-panel-eliminar="${producto.id}">Quitar</button>
                    </div>
                </div>
            </article>
        `).join("");
    }

    subtotalElemento.textContent = formatoPrecio(subtotal);
    checkout.setAttribute("aria-disabled", cantidadTotal === 0 ? "true" : "false");
    checkout.style.pointerEvents = cantidadTotal === 0 ? "none" : "auto";
    checkout.style.opacity = cantidadTotal === 0 ? "0.5" : "1";
}

function mostrarPanelCarrito() {
    const overlay = document.querySelector("#panel-carrito-overlay");
    if (!overlay) return;

    renderizarPanelCarrito();
    overlay.hidden = false;
    document.querySelectorAll("[data-abrir-carrito]").forEach(enlace => {
        enlace.setAttribute("aria-expanded", "true");
    });
    document.querySelector("#panel-carrito").focus();
}

function ocultarPanelCarrito() {
    const overlay = document.querySelector("#panel-carrito-overlay");
    if (!overlay) return;

    overlay.hidden = true;
    document.querySelectorAll("[data-abrir-carrito]").forEach(enlace => {
        enlace.setAttribute("aria-expanded", "false");
    });
}

// ==========================================
// CATÁLOGO DE PRODUCTOS
// ==========================================

function mostrarCatalogo(lista = productosTienda) {
    const contenedor = document.querySelector("#catalogo-productos");
    const cantidad = document.querySelector("#cantidad-productos");

    if (!contenedor) return;

    const disponibles = lista.filter(
        producto => producto.activo && producto.stock > 0
    );

    cantidad.textContent = `${disponibles.length} productos disponibles`;

    if (disponibles.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                No encontramos productos disponibles.
            </p>
        `;
        return;
    }

    contenedor.innerHTML = "";

    disponibles.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-tienda";

        tarjeta.innerHTML = `
            <img src="${obtenerImagen(producto)}" alt="${producto.nombre}" loading="lazy">

            <div class="tarjeta-info">
                <span class="tarjeta-categoria">
                    ${producto.categoria}
                </span>

                <h3>${producto.nombre}</h3>

                <p class="tarjeta-productor">
                    Productor: ${producto.productor}
                </p>

                <strong class="tarjeta-precio">
                    ${formatoPrecio(producto.precio)}
                </strong>

                <p class="tarjeta-stock">
                    Unidades disponibles: ${producto.stock}
                </p>

                <button
                    class="boton-tienda"
                    data-agregar="${producto.id}"
                >
                    Agregar al carrito
                </button>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

    contenedor.querySelectorAll("[data-agregar]").forEach(boton => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(Number(boton.dataset.agregar));
        });
    });
}

// ==========================================
// BUSCAR Y FILTRAR
// ==========================================

function configurarFiltros() {
    const buscar = document.querySelector("#buscar-tienda");
    const categoria = document.querySelector("#categoria-tienda");

    if (!buscar || !categoria) return;

    function aplicarFiltros() {
        const texto = buscar.value.toLowerCase().trim();
        const categoriaSeleccionada = categoria.value;

        const resultado = productosTienda.filter(producto => {
            const coincideNombre = producto.nombre
                .toLowerCase()
                .includes(texto);

            const coincideCategoria =
                !categoriaSeleccionada ||
                producto.categoria === categoriaSeleccionada;

            return coincideNombre && coincideCategoria;
        });

        mostrarCatalogo(resultado);
    }

    buscar.addEventListener("input", aplicarFiltros);
    categoria.addEventListener("change", aplicarFiltros);
}

// ==========================================
// AGREGAR PRODUCTOS AL CARRITO
// ==========================================

function agregarAlCarrito(id) {
    const producto = productosTienda.find(p => p.id === id);

    if (!producto || !producto.activo || producto.stock <= 0) {
        alert("Este producto no está disponible.");
        return;
    }

    const productoEnCarrito = carrito.find(item => item.id === id);

    const cantidadActual = productoEnCarrito
        ? productoEnCarrito.cantidad
        : 0;

    if (cantidadActual >= producto.stock) {
        alert("No hay más unidades disponibles de este producto.");
        return;
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            cantidad: 1
        });
    }

    guardarCarrito();

    if (document.querySelector("#panel-carrito-overlay")) {
        mostrarPanelCarrito();
    } else {
        alert(`${producto.nombre} fue agregado al carrito.`);
    }
}

// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {
    const contenedor = document.querySelector("#lista-carrito");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    let subtotal = 0;
    let cantidadTotal = 0;

    carrito = carrito.filter(item => {
        const producto = productosTienda.find(p => p.id === item.id);
        return producto && producto.activo && producto.stock > 0;
    });

    guardarCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-vacio">
                <h3>Tu carrito está vacío</h3>
                <p>Explora nuestro catálogo y agrega tus productos favoritos.</p>
                <br>
                <a href="catalogo.html" class="boton-tienda">
                    Ir al catálogo
                </a>
            </div>
        `;

        actualizarResumenCarrito(0, 0);
        return;
    }

    carrito.forEach(item => {
        const producto = productosTienda.find(p => p.id === item.id);

        if (!producto) return;

        const cantidadValida = Math.min(item.cantidad, producto.stock);
        item.cantidad = cantidadValida;

        const totalProducto = producto.precio * item.cantidad;

        subtotal += totalProducto;
        cantidadTotal += item.cantidad;

        const elemento = document.createElement("article");
        elemento.className = "item-carrito";

        elemento.innerHTML = `
            <img src="${obtenerImagen(producto)}" alt="${producto.nombre}">

            <div>
                <h3>${producto.nombre}</h3>
                <p>${formatoPrecio(producto.precio)} por unidad</p>

                <div class="cantidad-controles">
                    <button
                        type="button"
                        data-restar="${producto.id}"
                        aria-label="Restar una unidad"
                    >−</button>

                    <strong>${item.cantidad}</strong>

                    <button
                        type="button"
                        data-sumar="${producto.id}"
                        aria-label="Agregar una unidad"
                    >+</button>
                </div>

                <button
                    type="button"
                    class="boton-eliminar"
                    data-eliminar-carrito="${producto.id}"
                >
                    Eliminar producto
                </button>
            </div>

            <strong class="item-subtotal">
                ${formatoPrecio(totalProducto)}
            </strong>
        `;

        contenedor.appendChild(elemento);
    });

    actualizarResumenCarrito(cantidadTotal, subtotal);
    configurarBotonesCarrito();
    guardarCarrito();
}

function actualizarResumenCarrito(cantidad, subtotal) {
    document.querySelector("#resumen-cantidad").textContent = cantidad;
    document.querySelector("#resumen-subtotal").textContent = formatoPrecio(subtotal);
    document.querySelector("#resumen-total").textContent = formatoPrecio(subtotal);

    const boton = document.querySelector("#boton-checkout");

    if (boton) {
        boton.style.pointerEvents = cantidad === 0 ? "none" : "auto";
        boton.style.opacity = cantidad === 0 ? "0.5" : "1";
        boton.setAttribute("aria-disabled", cantidad === 0 ? "true" : "false");
    }
}

// ==========================================
// BOTONES PARA CAMBIAR CANTIDADES
// ==========================================

function configurarBotonesCarrito() {
    document.querySelectorAll("[data-sumar]").forEach(boton => {
        boton.addEventListener("click", () => {
            cambiarCantidad(Number(boton.dataset.sumar), 1);
        });
    });

    document.querySelectorAll("[data-restar]").forEach(boton => {
        boton.addEventListener("click", () => {
            cambiarCantidad(Number(boton.dataset.restar), -1);
        });
    });

    document.querySelectorAll("[data-eliminar-carrito]").forEach(boton => {
        boton.addEventListener("click", () => {
            eliminarDelCarrito(Number(boton.dataset.eliminarCarrito));
        });
    });
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(p => p.id === id);
    const producto = productosTienda.find(p => p.id === id);

    if (!item || !producto) return;

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    if (nuevaCantidad > producto.stock) {
        alert("No hay suficiente inventario para esa cantidad.");
        return;
    }

    item.cantidad = nuevaCantidad;

    guardarCarrito();
    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);

    guardarCarrito();
    mostrarCarrito();
}

// ==========================================
// RESUMEN DEL CHECKOUT
// ==========================================

function calcularTotalCarrito() {
    return carrito.reduce((total, item) => {
        const producto = productosTienda.find(p => p.id === item.id);

        if (!producto) return total;

        return total + producto.precio * item.cantidad;
    }, 0);
}

function mostrarResumenCheckout() {
    const contenedor = document.querySelector("#resumen-checkout");

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="mensaje-vacio">
                No tienes productos en tu carrito.
                <br><br>
                <a href="catalogo.html" class="boton-tienda">Ir al catálogo</a>
            </p>
        `;

        const formulario = document.querySelector("#formulario-checkout");
        formulario.querySelector("button[type='submit']").disabled = true;
        return;
    }

    let html = "";
    let cantidad = 0;

    carrito.forEach(item => {
        const producto = productosTienda.find(p => p.id === item.id);

        if (!producto) return;

        cantidad += item.cantidad;

        html += `
            <div class="producto-resumen">
                <span>${producto.nombre} x ${item.cantidad}</span>
                <strong>${formatoPrecio(producto.precio * item.cantidad)}</strong>
            </div>
        `;
    });

    const total = calcularTotalCarrito();

    html += `
        <div class="resumen-linea">
            <span>Cantidad de unidades</span>
            <strong>${cantidad}</strong>
        </div>

        <div class="resumen-linea total">
            <span>Total del pedido</span>
            <strong>${formatoPrecio(total)}</strong>
        </div>
    `;

    contenedor.innerHTML = html;
}

// ==========================================
// CONFIRMAR PEDIDO
// ==========================================

function configurarCheckout() {
    const formulario = document.querySelector("#formulario-checkout");

    if (!formulario) return;

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        // Comprobar nuevamente que exista suficiente inventario
        for (const item of carrito) {
            const producto = productosTienda.find(p => p.id === item.id);

            if (!producto || !producto.activo || producto.stock < item.cantidad) {
                alert("Uno de los productos ya no tiene suficiente inventario. Revisa tu carrito.");
                return;
            }
        }

        const datos = new FormData(formulario);

        const numeroPedido = "ECO-" + Date.now().toString().slice(-8);

        const pedido = {
            numero: numeroPedido,
            fecha: new Date().toLocaleString("es-CO"),
            cliente: {
                nombre: datos.get("nombre"),
                correo: datos.get("correo"),
                telefono: datos.get("telefono"),
                direccion: datos.get("direccion"),
                ciudad: datos.get("ciudad")
            },
            metodoPago: datos.get("metodoPago"),
            productos: carrito.map(item => {
                const producto = productosTienda.find(p => p.id === item.id);

                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: item.cantidad,
                    subtotal: producto.precio * item.cantidad
                };
            }),
            total: calcularTotalCarrito()
        };

        // Descontar las unidades compradas del inventario
        carrito.forEach(item => {
            const producto = productosTienda.find(p => p.id === item.id);
            producto.stock -= item.cantidad;
        });

        // Guardar inventario actualizado para el dashboard
        guardarProductosTienda();

        // Guardar el último pedido de demostración
        localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));

        // Vaciar carrito
        carrito = [];
        guardarCarrito();

        // Mostrar confirmación
        mostrarConfirmacion(pedido);
    });
}

// ==========================================
// MOSTRAR CONFIRMACIÓN DEL PEDIDO
// ==========================================

function mostrarConfirmacion(pedido) {
    document.querySelector("#zona-checkout").hidden = true;

    const confirmacion = document.querySelector("#confirmacion-pedido");
    confirmacion.hidden = false;

    document.querySelector("#numero-pedido").textContent =
        `Número de pedido: ${pedido.numero}`;

    let detalle = `
        <p><strong>Cliente:</strong> ${pedido.cliente.nombre}</p>
        <p><strong>Dirección:</strong> ${pedido.cliente.direccion}, ${pedido.cliente.ciudad}</p>
        <p><strong>Correo:</strong> ${pedido.cliente.correo}</p>
        <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
        <hr>
        <h3>Productos:</h3>
    `;

    pedido.productos.forEach(producto => {
        detalle += `
            <p>
                ${producto.nombre} x ${producto.cantidad} -
                ${formatoPrecio(producto.subtotal)}
            </p>
        `;
    });

    detalle += `
        <hr>
        <h3>Total: ${formatoPrecio(pedido.total)}</h3>
        <p><small>Fecha: ${pedido.fecha}</small></p>
    `;

    document.querySelector("#detalle-pedido").innerHTML = detalle;

    actualizarContadorCarrito();
}

// ==========================================
// INICIAR CUANDO CARGUE LA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", iniciarTienda);
