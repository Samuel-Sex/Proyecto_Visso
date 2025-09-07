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
  if (!window.validarRut ? rut.length < 8 : !window.validarRut(rut)) {
    const el = document.getElementById('rutError');
    el.textContent = 'Ingrese un RUT válido';
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
  } else {
    const el = document.getElementById('emailError');
    el.textContent = '';
    el.style.display = 'none';
  }

  // Validación de teléfono
  const telefono = document.getElementById('telefono').value.trim();
  if (!window.validarTelefonoChileno ? telefono.length < 9 : !window.validarTelefonoChileno(telefono)) {
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
  
    if(username === 'admin' && password === 'admin') {
      window.location.href = 'admin.html';
      return false;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(password)) {
      document.getElementById('passwordError').textContent =
        'La contraseña debe tener al menos 8 caracteres, incluyendo 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
      isValid = false;
    } else {
      document.getElementById('passwordError').textContent = '';
    }
  
    return isValid;
  }
  