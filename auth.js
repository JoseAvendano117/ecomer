const formUsuario = document.getElementById("formUsuario");
if (formUsuario) {
    formUsuario.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById("userName").value;
        const celular = document.getElementById("NumberPhone").value;
        const email = document.getElementById("userEmail").value;
        const password = document.getElementById("password").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({email, password, nombre, celular, tipo: 'usuario'});
        localStorage.setItem("users", JSON.stringify(users));
        alert("Usuario registrado exitosamente");
        window.location.href = "./login.html";
    });
}

const formVendedor = document.getElementById("formVendedor");
if (formVendedor) {
    formVendedor.addEventListener('submit', function(e){
        e.preventDefault();
        const nombre = document.getElementById("nameSeller").value;
        const celular = document.getElementById("phoneSeller").value;
        const email = document.getElementById("emailSeller").value;
        const password = document.getElementById("passwordSeller").value;
        const nit = document.getElementById("rucVendedor").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({email, password, nombre, celular, nit, tipo: 'vendedor'});
        localStorage.setItem("users", JSON.stringify(users));
        alert("Vendedor registrado exitosamente");
        window.location.href = "./login.html";
    });
}

const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        
        const user = users.find(u => u.email === email && u.password === password);
        console.log("Usuario encontrado:", user);
        if (user){
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Welcome");
            if (user.tipo === 'vendedor') {
                window.location.href = "./seller.html";
            } else {
                window.location.href = "./index.html";
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}