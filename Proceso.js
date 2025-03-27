// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB6drW4HUJ4gH4GQl_UnTKq-BmvMIqC4B8",
    authDomain: "juegomemoria-e0e8b.firebaseapp.com",
    projectId: "juegomemoria-e0e8b",
    storageBucket: "juegomemoria-e0e8b.firebasestorage.app",
    messagingSenderId: "752448716372",
    appId: "1:752448716372:web:44619f20a376d2e152b7c1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para iniciar sesión y redirigir al juego
window.EnviarJuego = function () {
    const nombre = document.getElementById("username").value.trim();
    if (nombre) {
        sessionStorage.setItem("nombreJugador", nombre); // Guardar en sessionStorage
        window.location.href = "juego.html";
    } else {
        alert("Por favor, ingresa un nombre.");
    }
};

// Variables del juego
const colores = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "cyan"];
const botones = document.querySelectorAll(".color-btn");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

let secuencia = [];
let usuarioSecuencia = [];
let nivel = 0;
let esperandoInput = false;
let nombreJugador = sessionStorage.getItem("nombreJugador") || "Invitado";

// Asigna colores a los botones y eventos
if (botones.length > 0) {
    botones.forEach((btn, index) => {
        btn.style.backgroundColor = colores[index];
        btn.addEventListener("click", () => manejarInput(index));
    });
}

if (startButton) {
    startButton.addEventListener("click", iniciarJuego);
}

function iniciarJuego() {
    secuencia = [];
    usuarioSecuencia = [];
    nivel = 0;
    esperandoInput = false;
    gameOverScreen.classList.add("hidden");
    scoreDisplay.innerText = "Puntaje: 0";
    nuevaRonda();
}

function nuevaRonda() {
    usuarioSecuencia = [];
    esperandoInput = false;
    nivel++;
    scoreDisplay.innerText = `Puntaje: ${nivel - 1}`;
    let nuevoColor = Math.floor(Math.random() * 9);
    secuencia.push(nuevoColor);
    reproducirSecuencia();
}

function reproducirSecuencia() {
    let i = 0;
    esperandoInput = false;
    const intervalo = setInterval(() => {
        if (i >= secuencia.length) {
            clearInterval(intervalo);
            esperandoInput = true;
            return;
        }
        let btn = botones[secuencia[i]];
        btn.style.opacity = "0.5";
        setTimeout(() => {
            btn.style.opacity = "1";
        }, 500);
        i++;
    }, 1000);
}

function manejarInput(index) {
    if (!esperandoInput) return;
    usuarioSecuencia.push(index);
    if (usuarioSecuencia[usuarioSecuencia.length - 1] !== secuencia[usuarioSecuencia.length - 1]) {
        registrarPuntaje();
        mostrarGameOver();
        return;
    }
    if (usuarioSecuencia.length === secuencia.length) {
        setTimeout(nuevaRonda, 1000);
    }
}

async function registrarPuntaje() {
    try {
        await addDoc(collection(db, "puntajes"), {
            nombre: nombreJugador,
            puntaje: nivel - 1,
            fecha: new Date().toISOString()
        });
        console.log("Puntaje registrado");
    } catch (error) {
        console.error("Error al registrar el puntaje:", error);
    }
}

function mostrarGameOver() {
    gameOverScreen.classList.remove("hidden");
    esperandoInput = false;
}

window.reiniciarJuego = function () {
    iniciarJuego();
};

window.volverInicio = function () {
    window.location.href = "index.html";
};