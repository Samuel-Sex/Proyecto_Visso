// Validación personalizada para teléfono chileno en el formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const telefonoInput = document.getElementById('telefono');
  const telefonoError = document.getElementById('telefonoError');

    // Validar al enviar
  form.addEventListener('submit', function(e) {
    if (telefonoInput.value.trim() && !window.validarTelefonoChileno(telefonoInput.value.trim())) {
      telefonoError.style.display = 'block';
      telefonoError.textContent = 'Por favor ingresa un teléfono chileno válido (+56 9 XXXX XXXX)';
      telefonoInput.focus();
      e.preventDefault();
    } else {
      telefonoError.style.display = 'none';
      telefonoError.textContent = '';
    }
  });
});


// [CAMBIO: Validación y envío para el formulario de contacto moderno]
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nombre = form.querySelector('#nombre');
  const email = form.querySelector('#email');
  const telefono = form.querySelector('#telefono');
  const asunto = form.querySelector('#asunto');
  const mensaje = form.querySelector('#mensaje');

  const nombreError = form.querySelector('#nombreError');
  const emailError = form.querySelector('#emailError');
  const telefonoError = form.querySelector('#telefonoError');
  const asuntoError = form.querySelector('#asuntoError');
  const mensajeError = form.querySelector('#mensajeError');
  const successMessage = form.querySelector('#successMessage');

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }
  function validateTelefono(tel) {
    return tel === '' || /^[0-9\-\+\s\(\)]{7,}$/.test(tel);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    // Reset
    [nombreError, emailError, telefonoError, asuntoError, mensajeError].forEach(el => el.style.display = 'none');
    successMessage.style.display = 'none';

    if (!nombre.value.trim()) {
      nombreError.style.display = 'block';
      valid = false;
    }
    if (!validateEmail(email.value)) {
      emailError.style.display = 'block';
      valid = false;
    }
    if (!validateTelefono(telefono.value)) {
      telefonoError.style.display = 'block';
      valid = false;
    }
    if (!asunto.value) {
      asuntoError.style.display = 'block';
      valid = false;
    }
    if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
      mensajeError.style.display = 'block';
      valid = false;
    }
    if (!valid) return;
    // Simulación de envío exitoso
    form.reset();
    successMessage.style.display = 'block';
    setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
  });
});
