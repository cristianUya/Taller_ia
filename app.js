
// ========================================
// VARIABLES GENERALES
// ========================================

let productos = [];
let graficoCategorias = null;

const formatoCOP = (valor) => new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
}).format(valor);

// ========================================
// ESTADO DEL INVENTARIO
// ========================================

function obtenerEstado(producto) {
    if (producto.stock === 0) {
        return "Agotado";
    }

    if (producto.stock <= producto.stockMinimo) {
        return "Stock bajo";
    }

    return "Disponible";
}

// ========================================
// FORMULARIO DE SUSCRIPCIÓN
// ========================================

const formularioSuscripcion = document.querySelector(".formulario-suscripcion");

if (formularioSuscripcion) {
    formularioSuscripcion.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nombre = document.querySelector("#nombre").value.trim();

        alert(`¡Gracias por suscribirte, ${nombre}! Pronto recibirás novedades de EcoMarket.`);

        formularioSuscripcion.reset();
    });
}

// ========================================
// INICIAR PANEL ADMINISTRATIVO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector("#tabla-productos")) {
        return;
    }

    cargarProductos();
    configurarEventos();
});

// ========================================
// CARGAR PRODUCTOS
// ========================================

async function cargarProductos() {
    const guardados = localStorage.getItem("ecoMarketProductos");

    if (guardados) {
        productos = JSON.parse(guardados);
    } else {
        try {
            const respuesta = await fetch("data/productos.json");

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar productos.json");
            }

            productos = await respuesta.json();
            guardarProductos();

        } catch (error) {
            alert("No se pudieron cargar los productos. Abre el proyecto con Live Server.");
            console.error(error);
            productos = [];
        }
    }

    renderizarProductos(productos);
    actualizarKPIs();
    actualizarGrafico();
}

// ========================================
// GUARDAR PRODUCTOS EN LOCALSTORAGE
// ========================================

function guardarProductos() {
    localStorage.setItem("ecoMarketProductos", JSON.stringify(productos));
}

// ========================================
// MOSTRAR PRODUCTOS
// ========================================

function renderizarProductos(lista) {
    const tabla = document.querySelector("#tabla-productos");
    const tarjetas = document.querySelector("#productos-tarjetas");

    if (tabla) {
        tabla.innerHTML = "";

        lista.forEach(producto => {
            const estado = obtenerEstado(producto);

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${formatoCOP(producto.precio)}</td>
                <td>${producto.stock}</td>
                <td>${producto.productor}</td>
                <td>
                    <span class="estado ${estado.toLowerCase().replace(" ", "-")}">
                        ${estado}
                    </span>
                </td>
                <td>
                    <button class="accion editar" data-editar="${producto.id}">
                        Editar
                    </button>

                    <button class="accion eliminar" data-eliminar="${producto.id}">
                        Eliminar
                    </button>
                </td>
            `;

            tabla.appendChild(fila);
        });
    }

    if (tarjetas) {
        tarjetas.innerHTML = "";

        lista.forEach(producto => {
            const tarjeta = document.createElement("article");

            tarjeta.className = "producto-admin";

            tarjeta.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>${producto.categoria} · ${producto.ciudad}</p>
                <strong>${formatoCOP(producto.precio)}</strong>
                <p>Stock: ${producto.stock} · ${obtenerEstado(producto)}</p>
            `;

            tarjetas.appendChild(tarjeta);
        });
    }

    const resultados = document.querySelector("#total-resultados");

    if (resultados) {
        resultados.textContent = `${lista.length} productos`;
    }
}

// ========================================
// ACTUALIZAR INDICADORES
// ========================================

function actualizarKPIs() {
    const activos = productos.filter(p => p.activo);

    const bajos = activos.filter(p =>
        p.stock > 0 && p.stock <= p.stockMinimo
    );

    const valor = activos.reduce((total, p) =>
        total + p.precio * p.stock, 0
    );

    const total = document.querySelector("#kpi-total");
    const bajo = document.querySelector("#kpi-bajo");
    const inventario = document.querySelector("#kpi-valor");

    if (total) total.textContent = activos.length;
    if (bajo) bajo.textContent = bajos.length;
    if (inventario) inventario.textContent = formatoCOP(valor);
}

// ========================================
// BUSCAR Y FILTRAR PRODUCTOS
// ========================================

function filtrarProductos() {
    const texto = document.querySelector("#buscar-producto").value.toLowerCase().trim();

    const categoria = document.querySelector("#filtro-categoria").value;
    const ciudad = document.querySelector("#filtro-ciudad").value;
    const estado = document.querySelector("#filtro-estado").value;

    const resultado = productos.filter(p => {
        const coincideTexto =
            p.nombre.toLowerCase().includes(texto) ||
            p.productor.toLowerCase().includes(texto);

        const coincideCategoria = !categoria || p.categoria === categoria;
        const coincideCiudad = !ciudad || p.ciudad === ciudad;
        const coincideEstado = !estado || obtenerEstado(p) === estado;

        return coincideTexto && coincideCategoria &&
            coincideCiudad && coincideEstado;
    });

    renderizarProductos(resultado);
}

// ========================================
// LIMPIAR FILTROS
// ========================================

function limpiarFiltros() {
    document.querySelector("#buscar-producto").value = "";
    document.querySelector("#filtro-categoria").value = "";
    document.querySelector("#filtro-ciudad").value = "";
    document.querySelector("#filtro-estado").value = "";

    renderizarProductos(productos);
}

// ========================================
// CONFIGURAR EVENTOS
// ========================================

function configurarEventos() {
    const filtros = [
        "#buscar-producto",
        "#filtro-categoria",
        "#filtro-ciudad",
        "#filtro-estado"
    ];

    filtros.forEach(selector => {
        document.querySelector(selector)?.addEventListener("input", filtrarProductos);
    });

    document.querySelector("#limpiar-filtros")?.addEventListener("click", limpiarFiltros);

    document.querySelector("#nuevo-producto")?.addEventListener("click", () => abrirModal());

    document.querySelector("#cerrar-modal")?.addEventListener("click", cerrarModal);

    document.querySelector("#cancelar-modal")?.addEventListener("click", cerrarModal);

    document.querySelector("#form-producto")?.addEventListener("submit", guardarProducto);

    document.addEventListener("click", evento => {
        const editar = evento.target.closest("[data-editar]");
        const eliminar = evento.target.closest("[data-eliminar]");

        if (editar) {
            abrirModal(Number(editar.dataset.editar));
        }

        if (eliminar) {
            eliminarProducto(Number(eliminar.dataset.eliminar));
        }
    });

    const menu = document.querySelector("#boton-menu");
    const sidebar = document.querySelector(".sidebar");

    menu?.addEventListener("click", () => {
        sidebar.classList.toggle("abierto");

        menu.setAttribute(
            "aria-expanded",
            sidebar.classList.contains("abierto")
        );

        menu.textContent = sidebar.classList.contains("abierto") ? "×" : "☰";
    });
}

// ========================================
// ABRIR FORMULARIO
// ========================================

function abrirModal(id = null) {
    const modal = document.querySelector("#modal-producto");
    const formulario = document.querySelector("#form-producto");

    formulario.reset();

    document.querySelector("#producto-id").value = "";

    document.querySelector("#modal-titulo").textContent =
        id ? "Editar producto" : "Agregar producto";

    if (id !== null) {
        const p = productos.find(item => item.id === id);

        if (!p) return;

        document.querySelector("#producto-id").value = p.id;
        document.querySelector("#nombre-producto").value = p.nombre;
        document.querySelector("#categoria-producto").value = p.categoria;
        document.querySelector("#precio-producto").value = p.precio;
        document.querySelector("#stock-producto").value = p.stock;
        document.querySelector("#minimo-producto").value = p.stockMinimo;
        document.querySelector("#productor-producto").value = p.productor;
        document.querySelector("#ciudad-producto").value = p.ciudad;
        document.querySelector("#organico-producto").checked = p.organico;
        document.querySelector("#activo-producto").checked = p.activo;
        document.querySelector("#fecha-producto").value = p.fechaRegistro;
    }

    modal.showModal();
}

// ========================================
// CERRAR FORMULARIO
// ========================================

function cerrarModal() {
    document.querySelector("#modal-producto").close();
}

// ========================================
// REGISTRAR Y EDITAR PRODUCTOS
// ========================================

function guardarProducto(evento) {
    evento.preventDefault();

    const idActual = document.querySelector("#producto-id").value;

    const producto = {
        id: idActual
            ? Number(idActual)
            : Math.max(0, ...productos.map(p => p.id)) + 1,

        nombre: document.querySelector("#nombre-producto").value.trim(),
        categoria: document.querySelector("#categoria-producto").value,
        precio: Number(document.querySelector("#precio-producto").value),
        stock: Number(document.querySelector("#stock-producto").value),
        stockMinimo: Number(document.querySelector("#minimo-producto").value),
        productor: document.querySelector("#productor-producto").value.trim(),
        ciudad: document.querySelector("#ciudad-producto").value,
        organico: document.querySelector("#organico-producto").checked,
        activo: document.querySelector("#activo-producto").checked,
        fechaRegistro: document.querySelector("#fecha-producto").value
    };

    const errores = validarProductos([
        ...productos.filter(p => p.id !== producto.id),
        producto
    ]);

    if (errores.length > 0) {
        alert(
            "Revisa los datos del producto:\n" +
            errores.map(e => e.campo + ": " + e.mensaje).join("\n")
        );
        return;
    }

    if (idActual) {
        productos = productos.map(p =>
            p.id === producto.id ? producto : p
        );
    } else {
        productos.push(producto);
    }

    guardarProductos();
    renderizarProductos(productos);
    actualizarKPIs();
    actualizarGrafico();
    cerrarModal();
}

// ========================================
// ELIMINAR PRODUCTOS
// ========================================

function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    if (confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`)) {
        productos = productos.filter(p => p.id !== id);

        guardarProductos();
        renderizarProductos(productos);
        actualizarKPIs();
        actualizarGrafico();
    }
}

// ========================================
// GRÁFICO DE PRODUCTOS POR CATEGORÍA
// ========================================

function actualizarGrafico() {
    const canvas = document.querySelector("#grafico-categorias");

    if (!canvas || typeof Chart === "undefined") return;

    const categorias = [
        "Frutas y verduras",
        "Despensa",
        "Cuidado personal",
        "Hogar sostenible"
    ];

    const cantidades = categorias.map(cat =>
        productos.filter(p => p.categoria === cat && p.activo).length
    );

    if (graficoCategorias) {
        graficoCategorias.destroy();
    }

    graficoCategorias = new Chart(canvas, {
        type: "bar",

        data: {
            labels: categorias,

            datasets: [{
                label: "Productos activos",
                data: cantidades
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
