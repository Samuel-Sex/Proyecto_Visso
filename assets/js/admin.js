let usuarios=[]
let productos=[]

function hoy(){
  const d=new Date()
  return d.toISOString().slice(0,10)
}

function siguienteId(arr){
  if(!arr.length) return 1
  return Math.max(...arr.map(a=>Number(a.id)||0))+1
}

function guardarUsuarios(){
  localStorage.setItem('usuarios',JSON.stringify(usuarios))
}

function guardarProductos(){
  localStorage.setItem('productos',JSON.stringify(productos))
}

function getModal(id){
  const el=document.getElementById(id)
  return bootstrap.Modal.getOrCreateInstance(el)
}

function normalizarTexto(s){
  return (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
}

function leerUsuariosDesdeDOM(){
  const filas=[...document.querySelectorAll('#usersTableBody tr')]
  return filas.map(tr=>{
    const tds=tr.querySelectorAll('td')
    return {
      id:Number(tds.textContent.trim()),
      name:tds[1].textContent.trim(),
      email:tds[7].textContent.trim(),
      phone:tds[10].textContent.trim(),
      fecha:tds[13].textContent.trim()
    }
  })
}

function renderUsuarios(){
  const tbody=document.getElementById('usersTableBody')
  tbody.innerHTML=usuarios.map(u=>
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone||''}</td>
      <td>${u.fecha||''}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-success btn-sm" onclick="editUser(${u.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
    ).join('')
  const total=document.getElementById('totalUsuarios')
  if(total) total.textContent=usuarios.length
  aplicarFiltroUsuarios()
}

function formatPrecio(v){
  const n=Number(v)||0
  return '$ '+n.toFixed(2)
}

function renderProductos(){
  const tbody=document.getElementById('productsTableBody')
  if(!tbody) return
  tbody.innerHTML=productos.map(p=>
    <tr>
      <td>${p.id}</td>
      <td>${p.image?`<img src="${p.image}" alt="Imagen" style="width:48px;height:48px;object-fit:cover" class="rounded">`:''}</td>
      <td>${p.name}</td>
      <td>${p.category||''}</td>
      <td>${formatPrecio(p.price)}</td>
      <td>${Number(p.stock)||0}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-success btn-sm" onclick="editProduct(${p.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
    ).join('')
  const total=document.getElementById('totalProducts')
  if(total) total.textContent=productos.length
  aplicarFiltroProductos()
}

function initUsuarios(){
  const guardados=localStorage.getItem('usuarios')
  if(guardados){
    try{usuarios=JSON.parse(guardados)||[]}catch(e){usuarios=[]}
  }else{
    usuarios=leerUsuariosDesdeDOM()
    guardarUsuarios()
  }
  renderUsuarios()
}

function initProductos(){
  const guardados=localStorage.getItem('productos')
  if(guardados){
    try{productos=JSON.parse(guardados)||[]}catch(e){productos=[]}
  }else{
    productos=[]
    guardarProductos()
  }
  renderProductos()
}

function openUserModal(){
  const form=document.getElementById('userForm')
  form.reset()
  document.getElementById('userId').value=''
  const title=document.getElementById('userModalTitle')
  if(title) title.textContent='Agregar Usuario'
  getModal('userModal').show()
}

function editUser(id){
  const u=usuarios.find(x=>Number(x.id)===Number(id))
  if(!u) return
  const form=document.getElementById('userForm')
  document.getElementById('userId').value=u.id
  document.getElementById('userName').value=u.name||''
  document.getElementById('userEmail').value=u.email||''
  document.getElementById('userPhone').value=u.phone||''
  document.getElementById('userPassword').value=''
  const title=document.getElementById('userModalTitle')
  if(title) title.textContent='Editar Usuario'
  getModal('userModal').show()
}

function saveUser(){
  const form=document.getElementById('userForm')
  if(!form.checkValidity()){
    form.reportValidity()
    return
  }
  const idVal=document.getElementById('userId').value
  const name=document.getElementById('userName').value.trim()
  const email=document.getElementById('userEmail').value.trim()
  const phone=document.getElementById('userPhone').value.trim()
  if(idVal){
    const idx=usuarios.findIndex(x=>Number(x.id)===Number(idVal))
    if(idx>-1){
      usuarios[idx].name=name
      usuarios[idx].email=email
      usuarios[idx].phone=phone
    }
  }else{
    const nuevo={
      id:siguienteId(usuarios),
      name,
      email,
      phone,
      fecha:hoy()
    }
    usuarios.push(nuevo)
  }
  guardarUsuarios()
  renderUsuarios()
  getModal('userModal').hide()
  form.reset()
}

function deleteUser(id){
  if(!confirm('¿Eliminar este usuario?')) return
  usuarios=usuarios.filter(x=>Number(x.id)!==Number(id))
  guardarUsuarios()
  renderUsuarios()
}

function openProductModal(){
  const form=document.getElementById('productForm')
  form.reset()
  document.getElementById('productId').value=''
  const title=document.getElementById('productModalTitle')
  if(title) title.textContent='Agregar Producto'
  getModal('productModal').show()
}

function editProduct(id){
  const p=productos.find(x=>Number(x.id)===Number(id))
  if(!p) return
  document.getElementById('productId').value=p.id
  document.getElementById('productName').value=p.name||''
  document.getElementById('productCategory').value=p.category||''
  document.getElementById('productPrice').value=p.price!=null?p.price:''
  document.getElementById('productStock').value=p.stock!=null?p.stock:''
  document.getElementById('productBrand').value=p.brand||''
  document.getElementById('productDescription').value=p.description||''
  document.getElementById('productImage').value=p.image||''
  const title=document.getElementById('productModalTitle')
  if(title) title.textContent='Editar Producto'
  getModal('productModal').show()
}

function saveProduct(){
  const form=document.getElementById('productForm')
  if(!form.checkValidity()){
    form.reportValidity()
    return
  }
  const idVal=document.getElementById('productId').value
  const name=document.getElementById('productName').value.trim()
  const category=document.getElementById('productCategory').value
  const price=parseFloat(document.getElementById('productPrice').value)||0
  const stock=parseInt(document.getElementById('productStock').value)||0
  const brand=document.getElementById('productBrand').value.trim()
  const description=document.getElementById('productDescription').value.trim()
  const image=document.getElementById('productImage').value.trim()
  if(idVal){
    const idx=productos.findIndex(x=>Number(x.id)===Number(idVal))
    if(idx>-1){
      productos[idx].name=name
      productos[idx].category=category
      productos[idx].price=price
      productos[idx].stock=stock
      productos[idx].brand=brand
      productos[idx].description=description
      productos[idx].image=image
    }
  }else{
    const nuevo={
      id:siguienteId(productos),
      name,category,price,stock,brand,description,image
    }
    productos.push(nuevo)
  }
  guardarProductos()
  renderProductos()
  getModal('productModal').hide()
  form.reset()
}

function deleteProduct(id){
  if(!confirm('¿Eliminar este producto?')) return
  productos=productos.filter(x=>Number(x.id)!==Number(id))
  guardarProductos()
  renderProductos()
}

function aplicarFiltroUsuarios(){
  const input=document.getElementById('userSearch')
  if(!input) return
  const q=normalizarTexto(input.value)
  const filas=[...document.querySelectorAll('#usersTableBody tr')]
  filas.forEach(tr=>{
    const texto=normalizarTexto(tr.textContent)
    tr.style.display=texto.includes(q)?'':'none'
  })
}

function aplicarFiltroProductos(){
  const input=document.getElementById('productSearch')
  if(!input) return
  const q=normalizarTexto(input.value)
  const filas=[...document.querySelectorAll('#productsTableBody tr')]
  filas.forEach(tr=>{
    const texto=normalizarTexto(tr.textContent)
    tr.style.display=texto.includes(q)?'':'none'
  })
}

document.addEventListener('DOMContentLoaded',function(){
  initUsuarios()
  initProductos()
  const us=document.getElementById('userSearch')
  if(us) us.addEventListener('input',aplicarFiltroUsuarios)
  const ps=document.getElementById('productSearch')
  if(ps) ps.addEventListener('input',aplicarFiltroProductos)
})

window.openUserModal=openUserModal
window.saveUser=saveUser
window.editUser=editUser
window.deleteUser=deleteUser
window.openProductModal=openProductModal
window.saveProduct=saveProduct
window.editProduct=editProduct
window.deleteProduct=deleteProduct
