
    // Datos de ejemplo (en producción estos vendrían de una base de datos)
    let users = [
        {id: 1, name: "Ana García", email: "ana@email.com", phone: "555-0101", date: "2024-01-15"},
        {id: 2, name: "Carlos Ruiz", email: "carlos@email.com", phone: "555-0102", date: "2024-01-20"},
        {id: 3, name: "María López", email: "maria@email.com", phone: "555-0103", date: "2024-02-05"},
        {id: 4, name: "José Hernández", email: "jose@email.com", phone: "555-0104", date: "2024-02-10"}
    ];

    let products = [
        {id: 1, name: "Ray-Ban Aviador Clásico", category: "lentes-sol", price: 89.99, stock: 25, brand: "Ray-Ban", description: "Lentes de sol estilo aviador clásico", image: "https://via.placeholder.com/100x60/667eea/FFFFFF?text=RB"},
        {id: 2, name: "Oakley Holbrook", category: "lentes-sol", price: 129.99, stock: 15, brand: "Oakley", description: "Lentes deportivos de alta calidad", image: "https://via.placeholder.com/100x60/764ba2/FFFFFF?text=OK"},
        {id: 3, name: "Marco Titanio Premium", category: "marcos", price: 159.99, stock: 8, brand: "Visso", description: "Marco ligero de titanio para lentes de receta", image: "https://via.placeholder.com/100x60/2c3e50/FFFFFF?text=TI"},
        {id: 4, name: "Lentes Progresivos", category: "lentes-receta", price: 199.99, stock: 12, brand: "Zeiss", description: "Lentes progresivos de alta definición", image: "https://via.placeholder.com/100x60/27ae60/FFFFFF?text=ZE"}
    ];

    let currentEditingUser = null;
    let currentEditingProduct = null;

    // Inicializar la aplicación
    document.addEventListener('DOMContentLoaded', function() {
        loadUsers();
        loadProducts();
        updateStats();
        
        // Eventos de búsqueda
        document.getElementById('userSearch').addEventListener('input', filterUsers);
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

    function filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm)
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

    function editUser(userId) {
        openUserModal(userId);
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    }

    function saveUser() {
        const form = document.getElementById('userForm');
        const formData = new FormData(form);
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            userData[key] = value;
        }
        
        if (currentEditingUser) {
            // Editar usuario existente
            const userIndex = users.findIndex(u => u.id === currentEditingUser);
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone
                };
            }
        } else {
            // Agregar nuevo usuario
            const newUser = {
                id: Math.max(...users.map(u => u.id)) + 1,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
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
                    <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 30px; object-fit: cover; border-radius: 5px;"></td>
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
                    <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 30px; object-fit: cover; border-radius: 5px;"></td>
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
                document.getElementById('productImage').value = product.image;
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
                    description: productData.description,
                    image: productData.image || products[productIndex].image
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
                description: productData.description,
                image: productData.image || 'https://via.placeholder.com/100x60/cccccc/FFFFFF?text=IMG'
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
