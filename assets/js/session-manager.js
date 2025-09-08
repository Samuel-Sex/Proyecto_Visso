// Gestor de sesión para todas las páginas
// Este archivo maneja la visualización del usuario logueado en el header
// [CAMBIO: Sistema de gestión de sesiones con preservación del botón del carrito]

document.addEventListener('DOMContentLoaded', function() {
    updateHeaderForLoggedUser();
});

function updateHeaderForLoggedUser() {
    if (!window.UsersData) return;
    
    const currentUser = window.UsersData.getCurrentUser();
    const loginButton = document.querySelector('a[href="auth.html"]');
    
    if (currentUser && loginButton) {
        // Crear dropdown de usuario
        const userDropdown = document.createElement('a');
        userDropdown.className = 'btn-getstarted d-flex align-items-center gap-1 dropdown-toggle';
        userDropdown.href = '#';
        userDropdown.setAttribute('data-bs-toggle', 'dropdown');
        userDropdown.setAttribute('aria-expanded', 'false');
        userDropdown.innerHTML = `
            <i class="bi bi-person-circle"></i> ${currentUser.name}
        `;
        
        // Crear el menú dropdown
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.innerHTML = `
            ${currentUser.isAdmin ? '<li><a class="dropdown-item" href="admin.html"><i class="bi bi-gear"></i> Panel Admin</a></li>' : ''}
            <li><a class="dropdown-item" href="tienda.html"><i class="bi bi-shop"></i> Tienda</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logoutUser()"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a></li>
        `;
        
        // Crear contenedor dropdown
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown';
        dropdownContainer.appendChild(userDropdown);
        dropdownContainer.appendChild(dropdownMenu);
        
        // Reemplazar solo el botón de login, manteniendo el botón del carrito
        loginButton.replaceWith(dropdownContainer);
    }
}

function logoutUser() {
    if (window.UsersData) {
        window.UsersData.logout();
    }
}

// Verificar si el usuario debe estar logueado para acceder a ciertas páginas
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['admin.html'];
    
    if (protectedPages.includes(currentPage)) {
        if (!window.UsersData || !window.UsersData.isUserLoggedIn()) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Verificar si es admin para admin.html
        if (currentPage === 'admin.html') {
            const currentUser = window.UsersData.getCurrentUser();
            if (!currentUser || !currentUser.isAdmin) {
                alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
                window.location.href = 'index.html';
                return;
            }
        }
    }
}

// Ejecutar verificación de acceso
checkPageAccess();