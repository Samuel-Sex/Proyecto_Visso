// Sistema de almacenamiento compartido de usuarios
// Este archivo maneja los datos de usuarios para auth.js y admin.js
//  [CAMBIO: Mensajes de error específicos para login y sistema de sesiones con localStorage]

// Función para obtener usuarios del localStorage o datos por defecto
function getUsers() {
    const storedUsers = localStorage.getItem('visso_users');
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    
    // Usuarios por defecto
    const defaultUsers = [
        {id: 1, rut: "12.345.678-9", name: "Ana García", email: "ana@email.com", phone: "+56 9 5555 0101", password: "Admin123!", date: "2024-01-15"},
        {id: 2, rut: "11.222.333-4", name: "Carlos Ruiz", email: "carlos@email.com", phone: "+56 9 5555 0102", password: "Admin123!", date: "2024-01-20"},
        {id: 3, rut: "15.666.777-8", name: "María López", email: "maria@email.com", phone: "+56 9 5555 0103", password: "Admin123!", date: "2024-02-05"},
        {id: 4, rut: "18.999.000-1", name: "José Hernández", email: "jose@email.com", phone: "+56 9 5555 0104", password: "Admin123!", date: "2024-02-10"}
    ];
    
    saveUsers(defaultUsers);
    return defaultUsers;
}

// Función para guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('visso_users', JSON.stringify(users));
}

// Función para agregar un nuevo usuario
function addUser(userData) {
    const users = getUsers();
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const newUser = {
        id: newId,
        rut: userData.rut,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        date: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Función para validar login
function validateLogin(email, password) {
    const users = getUsers();
    
    // Verificar admin por defecto
    if (email === 'admin' && password === 'admin') {
        return { success: true, isAdmin: true, user: null, message: '' };
    }
    
    // Buscar usuario por email
    const userByEmail = users.find(u => u.email === email);
    
    if (!userByEmail) {
        return { success: false, isAdmin: false, user: null, message: 'El usuario no existe' };
    }
    
    // Verificar contraseña
    if (userByEmail.password !== password) {
        return { success: false, isAdmin: false, user: null, message: 'Contraseña incorrecta' };
    }
    
    return { success: true, isAdmin: false, user: userByEmail, message: '' };
}

// Función para verificar si un email ya existe
function emailExists(email) {
    const users = getUsers();
    return users.some(u => u.email === email);
}

// Función para verificar si un RUT ya existe
function rutExists(rut) {
    const users = getUsers();
    return users.some(u => u.rut === rut);
}

// Funciones de sesión
function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('visso_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('visso_current_user');
    }
}

function getCurrentUser() {
    const userData = localStorage.getItem('visso_current_user');
    return userData ? JSON.parse(userData) : null;
}

function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

function logout() {
    localStorage.removeItem('visso_current_user');
    window.location.href = 'auth.html';
}

// Exportar funciones para uso global
window.UsersData = {
    getUsers,
    saveUsers,
    addUser,
    validateLogin,
    emailExists,
    rutExists,
    setCurrentUser,
    getCurrentUser,
    isUserLoggedIn,
    logout
};