
// Base de datos de productos simulada
const productos = [
    {
        id: 1,
        nombre: "Ray-Ban Aviator Classic",
        precio: 89990,
        categoria: "sol",
        imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        descripcion: "Las icónicas gafas de sol aviador de Ray-Ban. Un clásico atemporal que nunca pasa de moda.",
        caracteristicas: ["Protección UV 100%", "Lentes polarizados", "Montura de metal", "Estuche incluido"]
    },
    {
        id: 2,
        nombre: "Oakley Radar EV Path",
        precio: 129990,
        categoria: "deportivos",
        imagen: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        descripcion: "Gafas deportivas de alto rendimiento diseñadas para atletas profesionales.",
        caracteristicas: ["Tecnología Prizm", "Resistente al impacto", "Ajuste seguro", "Ventilación optimizada"]
    },
    {
        id: 3,
        nombre: "Lentes Progresivos Zeiss",
        precio: 199990,
        categoria: "oftalmicos",
        imagen: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        descripcion: "Lentes progresivos de última tecnología para una visión perfecta a todas las distancias.",
        caracteristicas: ["Tecnología progresiva", "Anti-reflejo", "Filtro luz azul", "Garantía 2 años"]
    },
    {
        id: 4,
        nombre: "Gafas de Lectura Milano",
        precio: 25990,
        categoria: "lectura",
        imagen: "assets/img/202314-transparent.jpg.webp",
        rating: 4.5,
        descripcion: "Elegantes gafas de lectura con diseño moderno y cómodo para uso diario.",
        caracteristicas: ["Múltiples graduaciones", "Montura ligera", "Diseño ergonómico", "Estuche rígido"]
    },
    {
        id: 5,
        nombre: "Tom Ford TF5401",
        precio: 299990,
        categoria: "oftalmicos",
        imagen: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        descripcion: "Montura de lujo Tom Ford con diseño sofisticado y materiales premium.",
        caracteristicas: ["Acetato italiano", "Diseño exclusivo", "Ajuste personalizable", "Certificado de autenticidad"]
    },
    {
        id: 6,
        nombre: "Polaroid PLD 2083/S",
        precio: 45990,
        categoria: "sol",
        imagen: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.4,
        descripcion: "Gafas de sol modernas con lentes polarizados para máxima protección.",
        caracteristicas: ["Lentes polarizados", "Protección UV", "Diseño contemporáneo", "Múltiples colores"]
    }
    
    
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productoActual = null;

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductos(productos);
    actualizarContadorCarrito();
});

// Función para mostrar productos
function mostrarProductos(productosArray) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (productosArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fs-1 text-muted mb-3"></i>
                <h4 class="text-muted">No se encontraron productos</h4>
                <p class="text-muted">Intenta con otros términos de búsqueda o filtros</p>
            </div>
        `;
        return;
    }

    productosArray.forEach(producto => {
        const stars = '★'.repeat(Math.floor(producto.rating)) + '☆'.repeat(5 - Math.floor(producto.rating));
        
        const productCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="product-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                    <div class="product-info">
                        <span class="badge-category">${obtenerNombreCategoria(producto.categoria)}</span>
                        <h5 class="product-title mt-2">${producto.nombre}</h5>
                        <div class="product-rating">
                            <span class="text-warning">${stars}</span>
                            <small class="text-muted ms-1">(${producto.rating})</small>
                        </div>
                        <div class="product-price">${producto.precio.toLocaleString('es-CL')}</div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-view-details flex-fill" onclick="verDetalles(${producto.id})">
                                <i class="fas fa-eye me-1"></i>Ver Detalles
                            </button>
                            <button class="btn btn-add-cart" onclick="agregarAlCarrito(${producto.id})">
                                <i class="bi bi-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// Función para obtener nombre de categoría
function obtenerNombreCategoria(categoria) {
    const categorias = {
        'oftalmicos': 'Oftálmicos',
        'sol': 'Gafas de Sol',
        'lectura': 'Lectura',
        'deportivos': 'Deportivos'
    };
    return categorias[categoria] || categoria;
}

// Filtros por categoría
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const categoria = this.dataset.category;
        let productosFiltrados = categoria === 'todos' ? productos : productos.filter(p => p.categoria === categoria);
        
        // Aplicar también el filtro de búsqueda si existe
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(searchTerm) ||
                p.categoria.toLowerCase().includes(searchTerm)
            );
        }
        
        mostrarProductos(productosFiltrados);
    });
});

// Búsqueda
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const categoriaActiva = document.querySelector('.filter-btn.active').dataset.category;
    
    let productosFiltrados = categoriaActiva === 'todos' ? productos : productos.filter(p => p.categoria === categoriaActiva);
    
    if (searchTerm) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );
    }
    
    mostrarProductos(productosFiltrados);
});

// Función para ver detalles
function verDetalles(id) {
    const producto = productos.find(p => p.id === id);
    productoActual = producto;
    
    if (producto) {
        document.getElementById('modalTitle').textContent = 'Detalles del Producto';
        document.getElementById('modalImage').src = producto.imagen;
        document.getElementById('modalImage').alt = producto.nombre;
        document.getElementById('modalCategory').textContent = obtenerNombreCategoria(producto.categoria);
        document.getElementById('modalProductTitle').textContent = producto.nombre;
        
        const stars = '★'.repeat(Math.floor(producto.rating)) + '☆'.repeat(5 - Math.floor(producto.rating));
        document.getElementById('modalRating').innerHTML = `
            <span class="text-warning">${stars}</span>
            <small class="text-muted ms-1">(${producto.rating})</small>
        `;
        
        document.getElementById('modalDescription').textContent = producto.descripcion;
        document.getElementById('modalPrice').textContent = `${producto.precio.toLocaleString('es-CL')}`;
        
        // Características
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        producto.caracteristicas.forEach(caracteristica => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check text-success me-2"></i>${caracteristica}`;
            featuresList.appendChild(li);
        });
        
        document.getElementById('quantity').value = 1;
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
}

// Cambiar cantidad
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    if (newValue >= 1 && newValue <= 10) {
        quantityInput.value = newValue;
    }
}

// Agregar al carrito desde modal
function addToCartFromModal() {
    if (productoActual) {
        const cantidad = parseInt(document.getElementById('quantity').value);
        agregarAlCarrito(productoActual.id, cantidad);
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
        
        // Mostrar notificación
        mostrarNotificacion('Producto agregado al carrito exitosamente', 'success');
    }
}

// Función para agregar al carrito
function agregarAlCarrito(id, cantidad = 1) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const itemExistente = carrito.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                categoria: producto.categoria,
                cantidad: cantidad
            });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        
        if (cantidad === 1) {
            mostrarNotificacion('Producto agregado al carrito', 'success');
        }
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    el.textContent = totalItems;
  }
  
// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${tipo} position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}
