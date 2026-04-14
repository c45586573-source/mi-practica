document.addEventListener("DOMContentLoaded", () => {
    // 1. NAVEGACIÓN SUAVE
    document.querySelectorAll('.nav-links button, .cta').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = document.getElementById(btn.getAttribute('data-section'));
            if (section) section.scrollIntoView({ behavior: "smooth" });
        });
    });

    // 2. LÓGICA DE CARDS
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("active");
        });
    });

    // 3. ASISTENTE VIRTUAL
    const chat = document.getElementById("chat");
    const opciones = document.getElementById("opciones");
    let tipoSeleccionado = "";

    function escribir(texto) {
        const mensaje = document.createElement("div");
        mensaje.className = "mensaje animate-in";
        mensaje.textContent = texto;
        chat.appendChild(mensaje);
        chat.scrollTop = chat.scrollHeight;
    }

    window.iniciarAsistente = function() {
        chat.innerHTML = "";
        escribir("¡Hola! Soy tu asistente de Costa Vibes. ¿Qué estilo buscas hoy?");
        opciones.innerHTML = `
            <button onclick="seleccionarTipo('Brilli Brilli')">Brilli Brilli ✨</button>
            <button onclick="seleccionarTipo('Costeña Pura')">Costeña Pura 🌴</button>
            <button onclick="seleccionarTipo('Calorcito')">Calorcito ☀️</button>
        `;
    }

    window.seleccionarTipo = function(tipo) {
        tipoSeleccionado = tipo;
        escribir(`Has elegido: ${tipo}`);
        escribir("¿Cuál es tu presupuesto aproximado?");
        opciones.innerHTML = `
            <button onclick="finalizar('alto')">Más de 100k</button>
            <button onclick="finalizar('bajo')">Menos de 100k</button>
        `;
    }

    window.finalizar = function(pres) {
        let plan = tipoSeleccionado === "Brilli Brilli" ? "Paquete Gala" : "Experiencia Caribe";
        escribir(`¡Excelente! Te recomiendo nuestro: ${plan}`);
        opciones.innerHTML = `<button onclick="iniciarAsistente()">Reiniciar</button>`;
        
        // WhatsApp automático del asistente
        setTimeout(() => {
            const waUrl = `https://wa.me/573135917346?text=Hola! El asistente me recomendó el ${plan}`;
            window.open(waUrl, '_blank');
        }, 1500);
    }

    iniciarAsistente();

    // 4. ENVÍO FORMULARIO (DB + WhatsApp)
    const formulario = document.getElementById("formulario");
    const mensajeForm = document.getElementById("mensajeForm");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formulario);
        
        mensajeForm.textContent = "Procesando...";
        mensajeForm.style.color = "gold";

        try {
            const response = await fetch('guardar.php', {
                method: 'POST',
                body: formData
            });
            
            // 1. Primero leemos la respuesta como texto normal
            const textResponse = await response.text();
            console.log("Respuesta cruda de PHP:", textResponse); // <-- Esto te dirá el problema real
            
            // 2. Luego intentamos convertirla a JSON
            const res = JSON.parse(textResponse);

            if (res.status === "success") {
                mensajeForm.textContent = "¡Registrado! Redirigiendo a WhatsApp...";
                mensajeForm.style.color = "#2ade45";

                setTimeout(() => {
                    const textoWA = `Hola, soy ${formData.get('nombre')}. Mi mensaje: ${formData.get('mensaje')}`;
                    window.location.href = `https://wa.me/573135917346?text=${encodeURIComponent(textoWA)}`;
                }, 1000);
            } else {
                mensajeForm.textContent = "Error: " + res.message;
            }
        } catch (error) {
            console.error("Error detectado en JS:", error);
            mensajeForm.textContent = "Error al procesar la respuesta del servidor.";
        }
    });
});