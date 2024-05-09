

document.addEventListener('DOMContentLoaded', function() {
    
    
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerForm = document.getElementById('register-form');
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;
    
        try {
            const response = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }) // Envía la contraseña sin hashear
            });
    
            const data = await response.json(); // Convierte la respuesta a JSON
    
            if (response.ok) {
                // Si la autenticación es exitosa, redirigir a la página de inicio
                window.location.href = '/home';
            } else {
                console.error('Error en la autenticación:', data.message);
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    });
    

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = registerUsername.value;
        const email = registerEmail.value;
        const password = registerPassword.value;
        try {
            const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            console.log(data);
            // Manejar la respuesta del backend (por ejemplo, mostrar un mensaje de éxito)
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
