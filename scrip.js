   // Modo oscuro
   const toggleBtn = document.getElementById('toggle-dark');
   toggleBtn.addEventListener('click', function() {
       document.body.classList.toggle('dark-mode');
   });

   // Carrito
   let carrito = {};
   const carritoBadge = document.querySelector('.carrito-badge-custom');
   const miniCarrito = document.getElementById('miniCarrito');
   const miniCarritoLista = document.getElementById('miniCarritoLista');
   const miniCarritoTotal = document.getElementById('miniCarritoTotal');
   const carritoDropdown = document.getElementById('carritoDropdown');
   const btnPagar = document.getElementById('btnPagar');
   const btnCancelar = document.getElementById('btnCancelar');
   const btnVaciar = document.getElementById('btnVaciar');

   // Sumar al carrito
   document.querySelectorAll('.btn-outline-primary').forEach(btn => {
       btn.addEventListener('click', function() {
           const card = btn.closest('.card');
           const nombre = card.querySelector('.card-title').textContent.trim();
           const productoDiv = card.closest('.producto-item');
           let precio = 0;
           if (productoDiv && productoDiv.dataset.precio) {
               precio = parseFloat(productoDiv.dataset.precio);
           } else {
               const precioText = card.querySelector('.precio-destacado').textContent.trim().replace('$','').replace('.','').replace(',','.');
               precio = parseFloat(precioText);
           }
           if (carrito[nombre]) {
               carrito[nombre].cantidad++;
           } else {
               carrito[nombre] = { cantidad: 1, precio: precio };
           }
           actualizarCarritoUI();
           // Animación badge
           carritoBadge.classList.add('agregado');
           setTimeout(() => carritoBadge.classList.remove('agregado'), 300);
       });
   });

   // Mostrar/ocultar mini-modal al hacer click en el carrito
   carritoDropdown.addEventListener('click', function(e) {
       e.preventDefault();
       miniCarrito.style.display = miniCarrito.style.display === 'block' ? 'none' : 'block';
   });

   // Ocultar mini-modal si se hace click fuera
   document.addEventListener('click', function(e) {
       if (!carritoDropdown.contains(e.target) && !miniCarrito.contains(e.target)) {
           miniCarrito.style.display = 'none';
       }
   });

   // Botón Pagar
   btnPagar.addEventListener('click', function() {
       $('#modalExito').modal('show');
       carrito = {};
       actualizarCarritoUI();
       miniCarrito.style.display = 'none';
   });

   // Botón Cancelar
   btnCancelar.addEventListener('click', function() {
       carrito = {};
       actualizarCarritoUI();
       miniCarrito.style.display = 'none';
       $('#modalCancelado').modal('show');
   });

   // Botón Vaciar carrito
   btnVaciar.addEventListener('click', function() {
       carrito = {};
       actualizarCarritoUI();
       miniCarrito.style.display = 'none';
   });

   function actualizarCarritoUI() {
       let totalCantidad = 0;
       let totalDinero = 0;
       let html = '';
       for (let producto in carrito) {
           totalCantidad += carrito[producto].cantidad;
           totalDinero += carrito[producto].cantidad * carrito[producto].precio;
       }
       carritoBadge.textContent = totalCantidad;

       if (totalCantidad === 0) {
           miniCarritoLista.innerHTML = 'El carrito está vacío.';
           btnPagar.disabled = true;
           btnCancelar.disabled = true;
           btnVaciar.disabled = true;
       } else {
           html = '<ul class="list-group mb-2">';
           for (let producto in carrito) {
               html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                           <span class="nombre-prod">${producto}</span>
                           <span>
                               <span class="badge cantidad-prod badge-pill">${carrito[producto].cantidad}</span>
                               <span class="precio-prod">$${(carrito[producto].precio * carrito[producto].cantidad).toFixed(2)}</span>
                           </span>
                       </li>`;
           }
           html += '</ul>';
           miniCarritoLista.innerHTML = html;
           btnPagar.disabled = false;
           btnCancelar.disabled = false;
           btnVaciar.disabled = false;
       }
       miniCarritoTotal.textContent = totalDinero.toFixed(2);
   }

   // Filtrar productos por precio
   document.getElementById('form-filtrar-precio').addEventListener('submit', function(e) {
       e.preventDefault();
       const min = document.getElementById('precio-min').value;
       const max = document.getElementById('precio-max').value;
       document.querySelectorAll('.producto-item').forEach(item => {
           const precio = parseFloat(item.dataset.precio);
           let mostrar = true;
           if (min && precio < parseFloat(min)) mostrar = false;
           if (max && precio > parseFloat(max)) mostrar = false;
           item.style.display = mostrar ? 'flex' : 'none';
       });
   });

   // Limpiar filtro
   document.getElementById('btn-limpiar-filtro').addEventListener('click', function() {
       document.getElementById('precio-min').value = '';
       document.getElementById('precio-max').value = '';
       document.querySelectorAll('.producto-item').forEach(item => {
           item.style.display = 'flex';
       });
   });