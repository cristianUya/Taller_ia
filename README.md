
# 🌱 EcoMarket

**Plataforma web para conectar productores locales con consumidores responsables.**

## 📌 Descripción del proyecto

EcoMarket es una plataforma web desarrollada para promover la compra de productos orgánicos y sostenibles. Su objetivo es conectar pequeños productores locales de Colombia con personas interesadas en consumir productos responsables con el medio ambiente.

El proyecto cuenta con una página principal para presentar los productos y un panel administrativo para gestionar el inventario.

## 🎯 Objetivos

- Promover el consumo de productos locales y sostenibles.
- Mostrar los productos disponibles.
- Facilitar la administración del inventario.
- Controlar las cantidades y los precios de los productos.

## 🛠️ Tecnologías utilizadas

- HTML5: estructura de las páginas.
- CSS3: diseño y adaptación a diferentes dispositivos.
- JavaScript: funcionalidades e interacción.
- JSON: almacenamiento inicial de los productos.
- LocalStorage: conservación de los cambios realizados.
- Chart.js: representación gráfica de los datos.

## 📂 Estructura del proyecto

```text
Taller_ia/
│
├── index.html
├── styles.css
├── dashboard.html
├── dashboard.css
├── app.js
│
├── data/
│   └── productos.json
│
└── js/
    └── validacion.js
```

## ⚙️ Funcionalidades

### Página principal

- Presentación de EcoMarket.
- Información sobre sus beneficios.
- Visualización de productos destacados.
- Secciones de productores y contacto.
- Formulario de suscripción.

### Panel administrativo

- Visualización de indicadores del inventario.
- Consulta de productos.
- Registro de nuevos productos.
- Edición de productos existentes.
- Eliminación de productos.
- Búsqueda y filtros.
- Identificación de productos con inventario bajo.
- Gráfico de información del inventario.

## 📊 Gestión del inventario

El sistema trabaja con 35 productos organizados en diferentes categorías:

- Frutas y verduras.
- Despensa.
- Cuidado personal.
- Hogar sostenible.

Cada producto contiene información como nombre, categoría, precio, stock, productor, ciudad y estado.

## ▶️ Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar la extensión Live Server.
4. Abrir el archivo `index.html`.
5. Hacer clic derecho y seleccionar **Open with Live Server**.
6. Para ingresar al panel administrativo, abrir `dashboard.html`.

**Importante:** Se recomienda utilizar Live Server para permitir la lectura del archivo JSON.

## 👨‍💻 Autor

**Cristian Andres Uyaban Becerra**

Proyecto académico de desarrollo web con inteligencia artificial.

## 📄 Repositorio

GitHub: https://github.com/cristianUya/Taller_ia
