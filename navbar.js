document.addEventListener("DOMContentLoaded", function () {
    // --- Navbar dinámico + modo oscuro ---
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm mb-3">
      <a class="navbar-brand font-weight-bold" href="./index.html">
          <i class="fa-solid fa-desktop"></i>
          TechStore
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                  <a class="nav-link" href="./index.html">Inicio <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#">Productos</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#">Ofertas</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#">Contacto</a>
              </li>
          </ul>
          <form class="form-inline my-2 my-lg-0 mx-lg-2 w-50">
              <input class="form-control mr-sm-2 w-75" type="search" placeholder="Buscar productos..."
                  aria-label="Buscar">
              <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Buscar</button>
          </form>
          <ul class="navbar-nav ml-lg-2">
              <li class="nav-item">
                  <a class="nav-link" href="./signup.html">
                      <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" width="24" height="24"
                          alt="User"> Sign Up
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="./signupvendedor.html">
                      <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" width="24" height="24"
                          alt="User"> Sign Up Seller
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="./login.html">
                      <i class="fas fa-user"></i> Login
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link position-relative carrito-dropdown" href="#" id="carritoDropdown">
                      <i class="fas fa-shopping-cart"></i>
                      <span class="badge badge-pill badge-danger carrito-badge-custom position-absolute"
                          style="top:0; right:0; font-size:0.7rem;">0</span>
                  </a>
              </li>
              <li class="nav-item">
                  <button id="toggle-dark" class="btn btn-sm btn-outline-secondary ml-2" title="Modo oscuro">
                      <i class="fas fa-moon"></i>
                  </button>
              </li>
          </ul>
      </div>
    </nav>`;
  
    document.getElementById("navbar").innerHTML = navbarHTML;
  
    // --- Modo oscuro ---
    const toggleBtn = document.getElementById('toggle-dark');
    function actualizarIcono() {
      if (document.body.classList.contains('dark-mode')) {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
    if (localStorage.getItem('modoOscuro') === 'true') {
      document.body.classList.add('dark-mode');
    }
    actualizarIcono();
  
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('modoOscuro', document.body.classList.contains('dark-mode'));
      actualizarIcono();
    });
  
    // --- Carrito ---
    let carrito = {};
    const carritoBadge = document.querySelector('.carrito-badge-custom');
    const miniCarrito = document.getElementById('miniCarrito');
    const miniCarritoLista = document.getElementById('miniCarritoLista');
    const miniCarritoTotal = document.getElementById('miniCarritoTotal');
    const carritoDropdown = document.getElementById('carritoDropdown');
    const btnPagar = document.getElementById('btnPagar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnVaciar = document.getElementById('btnVaciar');
  
    // Añadir producto al carrito al hacer click en botones .btn-outline-primary
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = btn.closest('.card');
        const nombre = card.querySelector('.card-title').textContent.trim();
        const productoDiv = card.closest('.producto-item');
        let precio = 0;
        if (productoDiv && productoDiv.dataset.precio) {
          precio = parseFloat(productoDiv.dataset.precio);
        } else {
          const precioText = card.querySelector('.precio-destacado').textContent.trim().replace('$', '').replace('.', '').replace(',', '.');
          precio = parseFloat(precioText);
        }
        if (carrito[nombre]) {
          carrito[nombre].cantidad++;
        } else {
          carrito[nombre] = { cantidad: 1, precio: precio };
        }
        actualizarCarritoUI();
        carritoBadge.classList.add('agregado');
        setTimeout(() => carritoBadge.classList.remove('agregado'), 300);
      });
    });
  
    // Mostrar/ocultar mini carrito al clickear el icono carrito
    carritoDropdown.addEventListener('click', function (e) {
      e.preventDefault();
      if (!miniCarrito) return;
      miniCarrito.style.display = miniCarrito.style.display === 'block' ? 'none' : 'block';
    });
  
    // Ocultar mini carrito si clickeas fuera
    document.addEventListener('click', function (e) {
      if (!carritoDropdown.contains(e.target) && !miniCarrito.contains(e.target)) {
        if (miniCarrito) miniCarrito.style.display = 'none';
      }
    });
  
    // Botón Pagar
    btnPagar?.addEventListener('click', function () {
      if (Object.keys(carrito).length === 0) {
        alert("El carrito está vacío, no hay nada para comprar.");
        return;
      }
      $('#modalExito').modal('show'); // Requiere Bootstrap y jQuery
      carrito = {};
      actualizarCarritoUI();
      if (miniCarrito) miniCarrito.style.display = 'none';
    });
  
    // Botón Cancelar
    btnCancelar?.addEventListener('click', function () {
      carrito = {};
      actualizarCarritoUI();
      if (miniCarrito) miniCarrito.style.display = 'none';
      $('#modalCancelado').modal('show'); // Requiere Bootstrap y jQuery
    });
  
    // Botón Vaciar carrito
    btnVaciar?.addEventListener('click', function () {
      carrito = {};
      actualizarCarritoUI();
      if (miniCarrito) miniCarrito.style.display = 'none';
    });
  
    // Funciones para botones aumentar, disminuir y eliminar (dinámicos)
    function aumentarCantidad(producto) {
      carrito[producto].cantidad++;
      actualizarCarritoUI();
    }
    function disminuirCantidad(producto) {
      carrito[producto].cantidad--;
      if (carrito[producto].cantidad <= 0) {
        delete carrito[producto];
      }
      actualizarCarritoUI();
    }
    function eliminarProducto(producto) {
      delete carrito[producto];
      actualizarCarritoUI();
    }
  
    // Actualiza la UI del carrito
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
        if (miniCarritoLista) miniCarritoLista.innerHTML = '<p>El carrito está vacío.</p>';
        if (btnPagar) btnPagar.disabled = true;
        if (btnCancelar) btnCancelar.disabled = true;
        if (btnVaciar) btnVaciar.disabled = true;
      } else {
        html = '<ul class="list-group mb-2">';
        for (let producto in carrito) {
          const item = carrito[producto];
          html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span class="nombre-prod">${producto}</span>
              <div>
                <button class="btn btn-sm btn-outline-secondary mr-1 btn-disminuir" data-producto="${producto}">-</button>
                <span class="badge cantidad-prod badge-pill">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary ml-1 btn-aumentar" data-producto="${producto}">+</button>
                <span class="precio-prod ml-3">$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger ml-3 btn-eliminar" data-producto="${producto}" title="Eliminar">x</button>
              </div>
            </li>`;
        }
        html += '</ul>';
        if (miniCarritoLista) miniCarritoLista.innerHTML = html;
        if (btnPagar) btnPagar.disabled = false;
        if (btnCancelar) btnCancelar.disabled = false;
        if (btnVaciar) btnVaciar.disabled = false;
  
        // Agregar listeners para botones dinámicos
        document.querySelectorAll('.btn-aumentar').forEach(btn => {
          btn.addEventListener('click', e => {
            const producto = e.target.dataset.producto;
            aumentarCantidad(producto);
          });
        });
        document.querySelectorAll('.btn-disminuir').forEach(btn => {
          btn.addEventListener('click', e => {
            const producto = e.target.dataset.producto;
            disminuirCantidad(producto);
          });
        });
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
          btn.addEventListener('click', e => {
            const producto = e.target.dataset.producto;
            eliminarProducto(producto);
          });
        });
      }
  
      if (miniCarritoTotal) miniCarritoTotal.textContent = totalDinero.toFixed(2);
    }
  
    // --- Filtros productos ---
    const formFiltrar = document.getElementById('form-filtrar-precio');
    const btnLimpiarFiltro = document.getElementById('btn-limpiar-filtro');
  
    if (formFiltrar && btnLimpiarFiltro) {
      formFiltrar.addEventListener('submit', function (e) {
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
  
      btnLimpiarFiltro.addEventListener('click', function () {
        document.getElementById('precio-min').value = '';
        document.getElementById('precio-max').value = '';
        document.querySelectorAll('.producto-item').forEach(item => {
          item.style.display = 'flex';
        });
      });
    }
  
    // Inicializar carrito UI
    actualizarCarritoUI();
  });
  