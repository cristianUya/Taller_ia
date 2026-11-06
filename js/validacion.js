// Valida la información de los productos.
function validarProductos(lista) {
    const errores = [];

    const categorias = [
        "Frutas y verduras",
        "Despensa",
        "Cuidado personal",
        "Hogar sostenible"
    ];

    const ciudades = [
        "Bucaramanga", "Floridablanca", "Girón", "Bogotá",
        "Medellín", "Cali", "Tunja", "Cúcuta"
    ];

    const ids = [];

    if (!Array.isArray(lista)) {
        return [{
            registro: "general",
            campo: "lista",
            mensaje: "La información debe ser una lista de productos."
        }];
    }

    lista.forEach((p, indice) => {
        const registro = p && p.id !== undefined ? p.id : indice + 1;

        if (!p || typeof p !== "object") {
            errores.push({
                registro,
                campo: "producto",
                mensaje: "El registro no es válido."
            });
            return;
        }

        if (!Number.isInteger(p.id) || p.id <= 0) {
            errores.push({ registro, campo: "id", mensaje: "El ID debe ser un entero mayor que cero." });
        }

        if (ids.includes(p.id)) {
            errores.push({ registro, campo: "id", mensaje: "El ID está repetido." });
        }
        ids.push(p.id);

        if (typeof p.nombre !== "string" || p.nombre.trim().length < 3 || p.nombre.length > 80) {
            errores.push({ registro, campo: "nombre", mensaje: "El nombre debe tener entre 3 y 80 caracteres." });
        }

        if (!categorias.includes(p.categoria)) {
            errores.push({ registro, campo: "categoria", mensaje: "La categoría no es válida." });
        }

        if (!Number.isInteger(p.precio) || p.precio <= 0) {
            errores.push({ registro, campo: "precio", mensaje: "El precio debe ser un entero positivo." });
        }

        if (!Number.isInteger(p.stock) || p.stock < 0) {
            errores.push({ registro, campo: "stock", mensaje: "El stock debe ser un entero igual o mayor que cero." });
        }

        if (!Number.isInteger(p.stockMinimo) || p.stockMinimo < 0) {
            errores.push({ registro, campo: "stockMinimo", mensaje: "El stock mínimo debe ser un entero igual o mayor que cero." });
        }

        if (typeof p.productor !== "string" || p.productor.trim().length < 3 || p.productor.length > 80) {
            errores.push({ registro, campo: "productor", mensaje: "El productor debe tener entre 3 y 80 caracteres." });
        }

        if (!ciudades.includes(p.ciudad)) {
            errores.push({ registro, campo: "ciudad", mensaje: "La ciudad no está permitida." });
        }

        if (typeof p.organico !== "boolean") {
            errores.push({ registro, campo: "organico", mensaje: "Debe ser verdadero o falso." });
        }

        if (typeof p.activo !== "boolean") {
            errores.push({ registro, campo: "activo", mensaje: "Debe ser verdadero o falso." });
        }

        if (typeof p.fechaRegistro !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.fechaRegistro)) {
            errores.push({ registro, campo: "fechaRegistro", mensaje: "La fecha debe tener formato AAAA-MM-DD." });
        } else {
            const fecha = new Date(p.fechaRegistro + "T00:00:00");
            const fechaValida = !Number.isNaN(fecha.getTime()) &&
                fecha.toISOString().slice(0, 10) === p.fechaRegistro;

            if (!fechaValida || p.fechaRegistro < "2026-01-01" || p.fechaRegistro > "2026-11-03") {
                errores.push({ registro, campo: "fechaRegistro", mensaje: "La fecha debe estar entre 2026-01-01 y 2026-11-03." });
            }
        }
    });

    return errores;
}