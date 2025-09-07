
    // Datos de ejemplo (en producción estos vendrían de una base de datos)
    // Eliminada declaración duplicada de users. Usar solo la versión con los 5 campos obligatorios.
            let users = [
                {id: 1, rut: "12.345.678-9", name: "Ana García", email: "ana@email.com", phone: "+56 9 5555 0101", password: "Admin123!", date: "2024-01-15"},
                {id: 2, rut: "11.222.333-4", name: "Carlos Ruiz", email: "carlos@email.com", phone: "+56 9 5555 0102", password: "Admin123!", date: "2024-01-20"},
                {id: 3, rut: "15.666.777-8", name: "María López", email: "maria@email.com", phone: "+56 9 5555 0103", password: "Admin123!", date: "2024-02-05"},
                {id: 4, rut: "18.999.000-1", name: "José Hernández", email: "jose@email.com", phone: "+56 9 5555 0104", password: "Admin123!", date: "2024-02-10"}
            ];
    
        let products = [
            {id: 1, name: "Ray-Ban Aviador Clásico", category: "lentes-sol", price: 129990, stock: 25, brand: "Ray-Ban", description: "Lentes de sol estilo aviador clásico"},
            {id: 2, name: "Oakley Holbrook", category: "lentes-sol", price: 119990, stock: 15, brand: "Oakley", description: "Lentes deportivos de alta calidad"},
            {id: 3, name: "Marco Titanio Premium", category: "marcos", price: 89990, stock: 8, brand: "Visso", description: "Marco ligero de titanio para lentes de receta"},
            {id: 4, name: "Lentes Progresivos", category: "lentes-receta", price: 159990, stock: 12, brand: "Zeiss", description: "Lentes progresivos de alta definición"}
        ];
    


    let currentEditingUser = null;
    let currentEditingProduct = null;

    // Inicializar la aplicación

    document.addEventListener('DOMContentLoaded', function() {
        loadUsers();
        loadProducts();
        updateStats();

        // Validación en tiempo real para el formulario de usuario
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.userName.addEventListener('input', function() {
                if (this.value.trim().length < 3) {
                    userNameError.textContent = 'El nombre debe tener al menos 3 caracteres';
                } else {
                    userNameError.textContent = '';
                }
            });
            userForm.userRut.addEventListener('input', function() {
                if (!window.validarRut(this.value.trim())) {
                    userRutError.textContent = 'Ingrese un RUT válido';
                } else {
                    userRutError.textContent = '';
                }
            });
            userForm.userEmail.addEventListener('input', function() {
                if (!window.validarEmail(this.value.trim())) {
                    userEmailError.textContent = 'Ingrese un email válido';
                } else {
                    userEmailError.textContent = '';
                }
            });
            userForm.userPhone.addEventListener('input', function() {
                if (!window.validarTelefonoChileno(this.value.trim())) {
                    userPhoneError.textContent = 'Ingrese un teléfono chileno válido (+56 9 XXXX XXXX)';
                } else {
                    userPhoneError.textContent = '';
                }
            });
            userForm.userPassword.addEventListener('input', function() {
                if (!window.validarPassword(this.value)) {
                    userPasswordError.textContent = 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
                } else {
                    userPasswordError.textContent = '';
                }
            });
        }

        // Validación al enviar el formulario
        if (userForm) {
            userForm.addEventListener('submit', function(e) {
                let valid = true;
                if (userForm.userName.value.trim().length < 3) {
                    userNameError.textContent = 'El nombre debe tener al menos 3 caracteres';
                    valid = false;
                }
                if (!window.validarRut(userForm.userRut.value.trim())) {
                    userRutError.textContent = 'Ingrese un RUT válido';
                    valid = false;
                }
                if (!window.validarEmail(userForm.userEmail.value.trim())) {
                    userEmailError.textContent = 'Ingrese un email válido';
                    valid = false;
                }
                if (!window.validarTelefonoChileno(userForm.userPhone.value.trim())) {
                    userPhoneError.textContent = 'Ingrese un teléfono chileno válido (+56 9 XXXX XXXX)';
                    valid = false;
                }
                if (!window.validarPassword(userForm.userPassword.value)) {
                    userPasswordError.textContent = 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
                    valid = false;
                }
                if (!valid) {
                    e.preventDefault();
                }
            });
        }

        // Eventos de búsqueda (si existen los inputs)
        if (document.getElementById('userSearch'))
            document.getElementById('userSearch').addEventListener('input', filterUsers);
        if (document.getElementById('productSearch'))
            document.getElementById('productSearch').addEventListener('input', filterProducts);
    });

    // FUNCIONES DE USUARIOS
    function loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
                users.forEach(user => {
                    const row = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.rut}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>********</td>
                            <td>${user.date}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-success btn-sm" onclick="editUser(${user.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });
    function filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
                user.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
        );
        
        filteredUsers.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.date}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-success btn-sm" onclick="editUser(${user.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    function openUserModal(userId = null) {
        currentEditingUser = userId;
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('userModalTitle');
        const form = document.getElementById('userForm');
        
        if (userId) {
            modalTitle.textContent = 'Editar Usuario';
            const user = users.find(u => u.id === userId);
            if (user) {
                  form.rut.value = user.rut;
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userPhone').value = user.phone;
                document.getElementById('userPassword').value = '';
            }
        } else {
            modalTitle.textContent = 'Agregar Usuario';
            form.reset();
            document.getElementById('userId').value = '';
        }
    }
    }

    function editUser(userId) {
        openUserModal(userId);
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    }

    function saveUser() {
                const form = document.getElementById('userForm');
                const rut = document.getElementById('userRut').value.trim();
                const name = document.getElementById('userName').value.trim();
                const email = document.getElementById('userEmail').value.trim();
                const phone = document.getElementById('userPhone').value.trim();
                const password = document.getElementById('userPassword').value;
                let valid = true;

                // Validaciones globales y mensajes en el formulario
                        if (!window.validarRut(rut)) {
                            const el = document.getElementById('userRutError');
                            el.textContent = 'Ingrese un RUT válido';
                            el.style.display = 'block';
                            valid = false;
                        } else {
                            const el = document.getElementById('userRutError');
                            el.textContent = '';
                            el.style.display = 'none';
                        }
                        if (name.length < 3) {
                            const el = document.getElementById('userNameError');
                            el.textContent = 'El nombre debe tener al menos 3 caracteres';
                            el.style.display = 'block';
                            valid = false;
                        } else {
                            const el = document.getElementById('userNameError');
                            el.textContent = '';
                            el.style.display = 'none';
                        }
                        if (!window.validarEmail(email)) {
                            const el = document.getElementById('userEmailError');
                            el.textContent = 'Ingrese un email válido';
                            el.style.display = 'block';
                            valid = false;
                        } else {
                            const el = document.getElementById('userEmailError');
                            el.textContent = '';
                            el.style.display = 'none';
                        }
                        if (!window.validarTelefonoChileno(phone)) {
                            const el = document.getElementById('userPhoneError');
                            el.textContent = 'Ingrese un teléfono chileno válido (+56 9 XXXX XXXX)';
                            el.style.display = 'block';
                            valid = false;
                        } else {
                            const el = document.getElementById('userPhoneError');
                            el.textContent = '';
                            el.style.display = 'none';
                        }
                        if (!window.validarPassword(password)) {
                            const el = document.getElementById('userPasswordError');
                            el.textContent = 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
                            el.style.display = 'block';
                            valid = false;
                        } else {
                            const el = document.getElementById('userPasswordError');
                            el.textContent = '';
                            el.style.display = 'none';
                        }
                if (!valid) return;

                if (currentEditingUser) {
                    // Editar usuario existente
                    const userIndex = users.findIndex(u => u.id === currentEditingUser);
                    if (userIndex !== -1) {
                        users[userIndex] = {
                            ...users[userIndex],
                            rut,
                            name,
                            email,
                            phone,
                            password
                        };
                    }
                } else {
                    // Agregar nuevo usuario
                    const newUser = {
                        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
                        rut,
                        name,
                        email,
                        phone,
                        password,
                        date: new Date().toISOString().split('T')[0]
                    };
                    users.push(newUser);
                }

                loadUsers();
                updateStats();

                const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
                modal.hide();
    }

    function deleteUser(userId) {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            users = users.filter(u => u.id !== userId);
            loadUsers();
            updateStats();
        }
    }

    // FUNCIONES DE PRODUCTOS
    function loadProducts() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><span class="badge bg-info">${getCategoryName(product.category)}</span></td>
                    <td>${product.price}</td>
                    <td>
                        <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-success btn-sm" onclick="editProduct(${product.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    function filterProducts() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        filteredProducts.forEach(product => {
            const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><span class="badge bg-info">${getCategoryName(product.category)}</span></td>
                    <td>${product.price}</td>
                    <td>
                        <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-success btn-sm" onclick="editProduct(${product.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    function getCategoryName(category) {
        const categories = {
            'lentes-receta': 'Lentes de Receta',
            'lentes-sol': 'Lentes de Sol',
            'marcos': 'Marcos',
            'contacto': 'Lentes de Contacto',
            'accesorios': 'Accesorios'
        };
        return categories[category] || category;
    }

    function openProductModal(productId = null) {
        currentEditingProduct = productId;
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');
        
        if (productId) {
            modalTitle.textContent = 'Editar Producto';
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('productId').value = product.id;
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productBrand').value = product.brand;
                document.getElementById('productDescription').value = product.description;
            }
        } else {
            modalTitle.textContent = 'Agregar Producto';
            form.reset();
            document.getElementById('productId').value = '';
        }
    }

    function editProduct(productId) {
        openProductModal(productId);
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    function saveProduct() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        const productData = {};
        
        for (let [key, value] of formData.entries()) {
            productData[key] = value;
        }
        
        if (currentEditingProduct) {
            // Editar producto existente
            const productIndex = products.findIndex(p => p.id === currentEditingProduct);
            if (productIndex !== -1) {
                products[productIndex] = {
                    ...products[productIndex],
                    name: productData.name,
                    category: productData.category,
                    price: parseFloat(productData.price),
                    stock: parseInt(productData.stock),
                    brand: productData.brand,
                    description: productData.description
                };
            }
        } else {
            // Agregar nuevo producto
            const newProduct = {
                id: Math.max(...products.map(p => p.id)) + 1,
                name: productData.name,
                category: productData.category,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                brand: productData.brand,
                description: productData.description
            };
            products.push(newProduct);
        }
        
        loadProducts();
        updateStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
    }

    function deleteProduct(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            products = products.filter(p => p.id !== productId);
            loadProducts();
            updateStats();
        }
    }

    // FUNCIONES GENERALES
    function updateStats() {
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalProducts').textContent = products.length;
    }
