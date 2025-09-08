// Funcionalidad para el sistema de autenticación
// Maneja registro y login de usuarios
// [CAMBIO: Integración de mensajes de error específicos y gestión de sesiones]

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const header = document.getElementById('header');
    const formTitle = document.getElementById('formTitle'); // Título login
    const registerTitle = document.getElementById('registerTitle'); // Título registro
  
    // Mostrar formulario registro
    showRegister.addEventListener('click', function() {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      if (header) header.style.display = 'none'; 
      if (formTitle) formTitle.style.display = 'none';
      if (registerTitle) registerTitle.style.display = 'block';
    });
  
    // Mostrar formulario login
    showLogin.addEventListener('click', function() {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      if (header) header.style.display = 'flex';
      if (registerTitle) registerTitle.style.display = 'none';
      if (formTitle) formTitle.style.display = 'block';
    });
  
    // Validación registro en tiempo real
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
  
    newPassword.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validatePasswordMatch);
  
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateRegistration()) {
        // Simular registro exitoso y redirigir a index.html
        window.location.href = 'index.html';
      }
    });
  
    // Validación envío login
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        validateForm();
      });
    }
  
    // Toggle mostrar/ocultar contraseñas
    document.querySelectorAll('.btn-toggle-password').forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
  
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      });
    });
  });
  
  function validateRegistration() {
  let isValid = true;

  // Validación de RUT
  const rut = document.getElementById('rut').value.trim();
  if (!validarRUT(rut)) {
    const el = document.getElementById('rutError');
    el.textContent = 'Ingrese un RUT válido (formato: 12345678-9)';
    el.style.display = 'block';
    isValid = false;
  } else if (window.UsersData && window.UsersData.rutExists(rut)) {
    const el = document.getElementById('rutError');
    el.textContent = 'Este RUT ya está registrado';
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('rutError');
    el.textContent = '';
    el.style.display = 'none';
  }

  // Validación de nombre
  const username = document.getElementById('newUsername').value.trim();
  if (username.length < 3) {
    const el = document.getElementById('usernameError');
    el.textContent = 'El nombre debe tener al menos 3 caracteres';
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('usernameError');
    el.textContent = '';
    el.style.display = 'none';
  }

  // Validación de email
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const el = document.getElementById('emailError');
    el.textContent = 'Ingrese un email válido';
    el.style.display = 'block';
    isValid = false;
  } else if (window.UsersData && window.UsersData.emailExists(email)) {
    const el = document.getElementById('emailError');
    el.textContent = 'Este email ya está registrado';
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('emailError');
    el.textContent = '';
    el.style.display = 'none';
  }

  // Validación de teléfono
  const telefono = document.getElementById('telefono').value.trim();
  if (!validarTelefonoChileno(telefono)) {
    const el = document.getElementById('telefonoError');
    el.textContent = 'Ingrese un teléfono chileno válido (+56 9 XXXX XXXX)';
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('telefonoError');
    el.textContent = '';
    el.style.display = 'none';
  }

  // Validación de contraseña
  if(!validatePassword()) {
    const el = document.getElementById('newPasswordError');
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('newPasswordError');
    el.style.display = 'none';
  }

  // Validación de confirmación de contraseña
  if(!validatePasswordMatch()) {
    const el = document.getElementById('confirmPasswordError');
    el.style.display = 'block';
    isValid = false;
  } else {
    const el = document.getElementById('confirmPasswordError');
    el.style.display = 'none';
  }

  // Si todo es válido, registrar usuario
  if (isValid && window.UsersData) {
    const newUser = window.UsersData.addUser({
      rut: rut,
      name: username,
      email: email,
      phone: telefono,
      password: document.getElementById('newPassword').value
    });
    
    alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
    
    // Cambiar a formulario de login
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    
    // Limpiar formulario de registro
    document.getElementById('registerForm').reset();
  }

  return isValid;
  }
  
  function validatePassword() {
    const password = document.getElementById('newPassword').value;
    const errorElement = document.getElementById('newPasswordError');
  
    errorElement.textContent = '';
  
    if (password.length < 8) {
      errorElement.textContent = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }
  
    if (!/[A-Z]/.test(password)) {
      errorElement.textContent = 'La contraseña debe contener al menos una letra mayúscula';
      return false;
    }
  
    if (!/[a-z]/.test(password)) {
      errorElement.textContent = 'La contraseña debe contener al menos una letra minúscula';
      return false;
    }
  
    if (!/\d/.test(password)) {
      errorElement.textContent = 'La contraseña debe contener al menos un número';
      return false;
    }
  
    if (!/[@$!%*?&]/.test(password)) {
      errorElement.textContent = 'La contraseña debe contener al menos un carácter especial (@$!%*?&)';
      return false;
    }
  
    return true;
  }
  
  function validatePasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
  
    if(password !== confirm) {
      document.getElementById('confirmPasswordError').textContent = 'Las contraseñas no coinciden';
      return false;
    } else {
      document.getElementById('confirmPasswordError').textContent = '';
      return true;
    }
  }
  
  function validateForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let isValid = true;
  
    // Limpiar errores previos
    document.getElementById('passwordError').textContent = '';
    
    // Validar usando el sistema compartido
     if (window.UsersData) {
       const loginResult = window.UsersData.validateLogin(username, password);
       
       if (loginResult.success) {
         // Guardar sesión del usuario
         if (loginResult.isAdmin) {
           window.UsersData.setCurrentUser({ name: 'Administrador', isAdmin: true });
           window.location.href = 'admin.html';
         } else {
           window.UsersData.setCurrentUser(loginResult.user);
           // Redirigir a la tienda para usuarios normales
           window.location.href = 'tienda.html';
         }
         return false;
       } else {
         document.getElementById('passwordError').textContent = loginResult.message;
         isValid = false;
       }
    } else {
      // Fallback al sistema anterior
      if(username === 'admin' && password === 'admin') {
        window.location.href = 'admin.html';
        return false;
      }
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if(!passwordRegex.test(password)) {
        document.getElementById('passwordError').textContent =
          'La contraseña debe tener al menos 8 caracteres, incluyendo 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
        isValid = false;
      }
    }
  
    return isValid;
  }

  // Función para validar RUT chileno
  function validarRUT(rut) {
    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return rutRegex.test(rut);
  }

  // Función para validar teléfono chileno
  function validarTelefonoChileno(telefono) {
    // Acepta formatos: +56912345678, 56912345678, 912345678, 9 1234 5678
    const telefonoRegex = /^(\+?56)?\s?9\s?[0-9]{4}\s?[0-9]{4}$/;
    return telefonoRegex.test(telefono.replace(/\s/g, ''));
  }
  