
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let itemAEliminar = null;

// Declarar cuponAplicado y cupones si no existen
let cuponAplicado = null;
const cupones = {
  'VISSO10': { descuento: 0.10, descripcion: '10% de descuento' },
  'VISSO20': { descuento: 0.20, descripcion: '20% de descuento' }
};



document.addEventListener('DOMContentLoaded', function () {
  cargarCarrito();
  actualizarContadores();
});

function cargarCarrito() {
  const container = document.getElementById('cartItemsContainer');

  if (carrito.length === 0) {
    container.innerHTML = `
      <div id="carro_completo" class="empty-cart text-center">
        <link href="assets/css/style.css" rel="stylesheet">
        <i class="bi bi-bag fs-1 mb-3"></i>
        <h3 class="mb-3" id="carrito_vacio">Tu carrito está vacío</h3>
        <p id="parrafo_carrito" class="text-muted mb-4">¡Agrega algunos productos increíbles a tu carrito!</p>
    <a id="irTienda" href="tienda.html" class="btn-getstarted d-inline-flex align-items-center gap-1" style="background:#fff; color:#2c5282; border:2px solid #2c5282;">
        Ir a la Tienda
        </a>
      </div>
    `;
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  container.innerHTML = '';
  carrito.forEach((item) => {
    const cartItem = `
      <div class="cart-item" id="item-${item.id}">
        <div class="row align-items-center">
          <div class="col-md-2 col-3">
            <img src="${item.imagen}" alt="${item.nombre}" class="item-image">
          </div>
          <div class="col-md-4 col-9">
            <h6 class="item-name">${item.nombre}</h6>
            <p class="item-category mb-0">${obtenerNombreCategoria(item.categoria)}</p>
          </div>
          <div class="col-md-2 col-6 mt-3 mt-md-0">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
              <input type="number" class="quantity-input" value="${item.cantidad}" min="0" max="10" onchange="actualizarCantidad(${item.id}, this.value)">
              <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
          </div>
          <div class="col-md-2 col-3 mt-3 mt-md-0 text-center">
            <div class="item-price">${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
          </div>
          <div class="col-md-2 col-3 mt-3 mt-md-0 text-center">
            <button class="remove-btn" onclick="mostrarConfirmacionEliminacion(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cartItem;
  });

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function obtenerNombreCategoria(categoria) {
  const categorias = {
    'oftalmicos': 'Oftálmicos',
    'sol': 'Gafas de Sol',
    'lectura': 'Lectura',
    'deportivos': 'Deportivos'
  };
  return categorias[categoria] || categoria;
}

// Cambiar cantidad con botones +/- (acepta 0 y elimina)
function cambiarCantidad(id, cambio) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  const nuevaCantidad = item.cantidad + cambio;
  if (nuevaCantidad >= 0 && nuevaCantidad <= 10) {
    if (nuevaCantidad === 0) {
      carrito = carrito.filter(i => i.id !== id);
    } else {
      item.cantidad = nuevaCantidad;
    }
    guardarCarrito();
    cargarCarrito();
    actualizarContadores();
  }
}

// Cambiar cantidad escribiendo en el input (acepta 0 y elimina)
function actualizarCantidad(id, nuevaCantidad) {
  const cantidad = parseInt(nuevaCantidad);
  if (Number.isNaN(cantidad) || cantidad < 0 || cantidad > 10) {
    cargarCarrito(); // restaurar si es inválido
    return;
  }
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  if (cantidad === 0) {
    carrito = carrito.filter(i => i.id !== id);
  } else {
    item.cantidad = cantidad;
  }
  guardarCarrito();
  cargarCarrito();
  actualizarContadores();
}

function mostrarConfirmacionEliminacion(id) {
  itemAEliminar = id;
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

function confirmarEliminacion() {
  if (itemAEliminar != null) {
    carrito = carrito.filter(item => item.id !== itemAEliminar);
    guardarCarrito();
    cargarCarrito();
    actualizarContadores();

    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    if (modal) modal.hide();

    mostrarNotificacion('Producto eliminado del carrito', 'success');
    itemAEliminar = null;
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContadores() {
  // Contador del header (tolerante si no existe el elemento)
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = totalItems;


  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const iva = Math.round(subtotal * 0.19);
  const descuento = cuponAplicado ? Math.round(subtotal * cuponAplicado.descuento) : 0;
  const total = subtotal - descuento;

  const elSubtotal = document.getElementById('subtotal');
  const elIva = document.getElementById('iva');
  const elTotal = document.getElementById('total');
  if (elSubtotal) elSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')}`;
  if (elIva) elIva.textContent = `$${iva.toLocaleString('es-CL')}`;
  if (elTotal) elTotal.textContent = `$${total.toLocaleString('es-CL')}`;

  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('discount');
  if (descuento > 0 && discountRow && discountEl) {
    discountRow.style.display = 'flex';
    discountEl.textContent = `-$${descuento.toLocaleString('es-CL')}`;
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }

  // Deshabilitar checkout si está vacío (doble seguridad)
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = carrito.length === 0;
}

function aplicarCupon() {
  const codigoCupon = document.getElementById('couponInput').value.trim().toUpperCase();

  if (!codigoCupon) {
    mostrarMensajeCupon('Por favor ingresa un código de cupón', 'error');
    return;
  }

  if (cupones[codigoCupon]) {
    if (cuponAplicado && cuponAplicado.codigo === codigoCupon) {
      mostrarMensajeCupon('Este cupón ya está aplicado', 'error');
      return;
    }

    cuponAplicado = {
      codigo: codigoCupon,
      descuento: cupones[codigoCupon].descuento,
      descripcion: cupones[codigoCupon].descripcion
    };

    mostrarMensajeCupon(`Cupón aplicado: ${cuponAplicado.descripcion}`, 'success');
    const input = document.getElementById('couponInput');
    if (input) input.disabled = true;
    actualizarContadores();
  } else {
    mostrarMensajeCupon('Código de cupón inválido', 'error');
  }
}

function mostrarMensajeCupon(mensaje, tipo) {
  const messageDiv = document.getElementById('couponMessage');
  if (!messageDiv) return;
  messageDiv.className = `mt-2 ${tipo === 'success' ? 'text-success' : 'text-danger'}`;
  messageDiv.textContent = mensaje;
  messageDiv.style.display = 'block';
}

function procederPago() {
  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío', 'error');
    return;
  }
  actualizarResumenCheckout();
  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
  
  // Agregar event listeners para actualización en tiempo real
  agregarEventListenersCheckout();
}

function agregarEventListenersCheckout() {
  const rutInput = document.getElementById('checkoutRut');
  const telefonoInput = document.getElementById('checkoutTelefono');
  
  if (rutInput) {
    rutInput.addEventListener('input', function() {
      formatearRUT(this);
      actualizarResumenCheckout();
    });
  }
  
  if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
      formatearTelefono(this);
      actualizarResumenCheckout();
    });
  }
  
  // Agregar listeners a todos los campos para actualizar resumen
  const campos = ['checkoutNombre', 'checkoutEmail', 'checkoutDireccion', 'checkoutComuna', 'checkoutRegion'];
  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', actualizarResumenCheckout);
    }
  });
}

function formatearRUT(input) {
  let valor = input.value.replace(/[^0-9kK]/g, '');
  
  if (valor.length > 1) {
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);
    
    // Formatear con puntos
    let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    input.value = cuerpoFormateado + '-' + dv;
  } else {
    input.value = valor;
  }
}

function formatearTelefono(input) {
  let valor = input.value.replace(/[^0-9+]/g, '');
  
  if (valor.startsWith('56')) {
    // Formato: +56 9 XXXX XXXX
    if (valor.length >= 11) {
      valor = '+56 ' + valor.substring(2, 3) + ' ' + valor.substring(3, 7) + ' ' + valor.substring(7, 11);
    } else if (valor.length >= 7) {
      valor = '+56 ' + valor.substring(2, 3) + ' ' + valor.substring(3, 7) + ' ' + valor.substring(7);
    } else if (valor.length >= 3) {
      valor = '+56 ' + valor.substring(2, 3) + ' ' + valor.substring(3);
    } else {
      valor = '+56 ' + valor.substring(2);
    }
  } else if (valor.startsWith('9')) {
    // Formato: +56 9 XXXX XXXX
    if (valor.length >= 9) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1, 5) + ' ' + valor.substring(5, 9);
    } else if (valor.length >= 5) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1, 5) + ' ' + valor.substring(5);
    } else if (valor.length >= 1) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1);
    }
  } else if (valor.startsWith('+56')) {
    // Ya tiene el formato correcto, solo formatear
    valor = valor.replace('+56', '');
    if (valor.length >= 9) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1, 5) + ' ' + valor.substring(5, 9);
    } else if (valor.length >= 5) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1, 5) + ' ' + valor.substring(5);
    } else if (valor.length >= 1) {
      valor = '+56 ' + valor.substring(0, 1) + ' ' + valor.substring(1);
    } else {
      valor = '+56 ';
    }
  }
  
  input.value = valor;
}

function actualizarResumenCheckout() {
  const resumenDiv = document.getElementById('checkoutResumen');
  const subtotalSpan = document.getElementById('checkoutSubtotal');
  const totalSpan = document.getElementById('checkoutTotal');
  const descuentoRow = document.getElementById('checkoutDescuentoRow');
  const descuentoSpan = document.getElementById('checkoutDescuento');

  if (!resumenDiv || !subtotalSpan || !totalSpan) return;

  // Obtener datos del formulario
  const nombre = document.getElementById('checkoutNombre')?.value || '';
  const rut = document.getElementById('checkoutRut')?.value || '';
  const email = document.getElementById('checkoutEmail')?.value || '';
  const telefono = document.getElementById('checkoutTelefono')?.value || '';
  const direccion = document.getElementById('checkoutDireccion')?.value || '';
  const comuna = document.getElementById('checkoutComuna')?.value || '';
  const region = document.getElementById('checkoutRegion')?.value || '';

  // Generar resumen de productos
  let resumenHTML = '<h6 class="mb-3">Productos</h6>';
  carrito.forEach(item => {
    resumenHTML += `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <small class="fw-bold">${item.nombre}</small>
          <br><small class="text-muted">Cantidad: ${item.cantidad}</small>
        </div>
        <small class="fw-bold">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</small>
      </div>
    `;
  });
  
  // Agregar información del cliente si hay datos
  if (nombre || rut || email || telefono || direccion) {
    resumenHTML += '<hr><h6 class="mb-3 mt-3">Datos del Cliente</h6>';
    
    if (nombre) {
      resumenHTML += `<div class="mb-1"><small><strong>Nombre:</strong> ${nombre}</small></div>`;
    }
    
    if (rut) {
      const rutValido = validarRUT(rut);
      const iconoRut = rutValido ? '<i class="bi bi-check-circle text-success"></i>' : '<i class="bi bi-x-circle text-danger"></i>';
      resumenHTML += `<div class="mb-1"><small><strong>RUT:</strong> ${rut} ${iconoRut}</small></div>`;
    }
    
    if (email) {
      resumenHTML += `<div class="mb-1"><small><strong>Email:</strong> ${email}</small></div>`;
    }
    
    if (telefono) {
      resumenHTML += `<div class="mb-1"><small><strong>Teléfono:</strong> ${telefono}</small></div>`;
    }
    
    if (direccion || comuna || region) {
      resumenHTML += '<div class="mb-1"><small><strong>Dirección:</strong> ';
      if (direccion) resumenHTML += direccion;
      if (comuna) resumenHTML += `, ${comuna}`;
      if (region) resumenHTML += `, ${region}`;
      resumenHTML += '</small></div>';
    }
  }
  
  resumenDiv.innerHTML = resumenHTML;

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  let descuento = 0;
  
  if (cuponAplicado) {
    descuento = subtotal * cuponAplicado.descuento;
    descuentoRow.style.display = 'flex';
    descuentoSpan.textContent = `-$${descuento.toLocaleString('es-CL')}`;
  } else {
    descuentoRow.style.display = 'none';
  }

  const total = subtotal - descuento;
  
  subtotalSpan.textContent = `$${subtotal.toLocaleString('es-CL')}`;
  totalSpan.textContent = `$${total.toLocaleString('es-CL')}`;
}

function finalizarCompra() {
  const form = document.getElementById('checkoutForm');

  // Validación de formulario
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  // Validar RUT (simplificado)
  const rut = document.getElementById('checkoutRut').value.trim();
  if (!validarRUT(rut)) {
    document.getElementById('checkoutRut').setCustomValidity('RUT inválido');
    form.classList.add('was-validated');
    return;
  } else {
    document.getElementById('checkoutRut').setCustomValidity('');
  }

  // Actualizar resumen del checkout antes de finalizar
  actualizarResumenCheckout();

  // Simular procesamiento del pago
  const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  if (modal) modal.hide();

  // Limpiar carrito
  carrito = [];
  guardarCarrito();

  // Notificación
  mostrarNotificacion('¡Compra realizada exitosamente! Te enviaremos un email con los detalles.', 'success', 5000);

  // Refrescar
  setTimeout(() => {
    cargarCarrito();
    actualizarContadores();
  }, 1000);
}

function validarRUT(rut) {
  // Limpiar el RUT de puntos, espacios y guiones
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  
  // Verificar que tenga al menos 2 caracteres (número + dígito verificador)
  if (rutLimpio.length < 2) {
    return false;
  }
  
  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();
  
  // Verificar que el cuerpo sean solo números
  if (!/^[0-9]+$/.test(cuerpo)) {
    return false;
  }
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  // Recorrer de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
  
  return dv === dvCalculado;
}

function mostrarNotificacion(mensaje, tipo = 'success', duracion = 3000) {
  const notification = document.createElement('div');
  notification.className = `alert alert-${tipo === 'error' ? 'danger' : tipo} position-fixed`;
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
  }, duracion);
}
