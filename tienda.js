
// ==========================================
// CONFIGURACIÓN GENERAL DE ECOMARKET
// ==========================================

const CLAVE_PRODUCTOS = "ecoMarketProductos";
const CLAVE_CARRITO = "ecoMarketCarrito";
const CLAVE_PEDIDO = "ecoMarketUltimoPedido";

let productosTienda = [];
let carrito = [];

const formatoPrecio = (valor) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
};

// Imágenes de apoyo según la categoría
function obtenerImagen(producto) {
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
            <img
                src="${obtenerImagen(producto)}"
                alt="${producto.nombre}"
                loading="lazy"
            >

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

    alert(`${producto.nombre} fue agregado al carrito.`);
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
