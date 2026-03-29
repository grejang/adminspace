function addToLog(message) {
    const logArea = document.getElementById("logArea");
    const p = document.createElement("p");
    p.textContent = message;
    logArea.appendChild(p);
    logArea.scrollTop = logArea.scrollHeight;
}

function sendText() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    // Ottieni risposta dal file risposte.js
    const message = getRisposta(text);

    addToLog(message);
    input.value = "";
}

// Messaggio iniziale appena la pagina è pronta
window.addEventListener("DOMContentLoaded", () => {
    addToLog("***ADMINSPACE Console V2.0.84***");
	document.getElementById('title2').style.display = 'none';
	document.getElementById('ver').style.display = 'none';
});

function yes() {
	document.getElementById('confirm').style.display = 'none';
	document.getElementById('title1').style.display = 'none';
	document.getElementById('title2').style.display = 'flex';
	document.getElementById('ver').style.display = 'flex';
}

function no() {
	const params = new URLSearchParams(window.location.search);
	const admin = params.get('admin');
	location.href = 'adminspace.html?admin=' + admin;
}
