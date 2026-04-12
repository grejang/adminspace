const params_3 = new URLSearchParams(window.location.search);
const admin_3 = params_3.get("admin");
const background = document.getElementById("background");


document.getElementById("background").addEventListener("change", function() {
  if (this.value === "white") {
	background.style.background = "rgba(255, 255, 255, 0.75)";
	background.style.color = "#000000";
  } else {
	background.style.background = "rgba(0, 0, 0, 0.75)";
	background.style.color = "#ffffff";
  }
});

async function create(e) {
  e.preventDefault();
  const stato = document.getElementById("stato");
  const unicode = document.getElementById("unicode").value.trim();
  const background = document.getElementById("background").value;
  const text = "Friend invite request from: ";

  stato.textContent = "❏ Elaborazione...";
  stato.style.color= "#ff9206";

  const risposta = await fetch("https://formspree.io/f/xpqydpyg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Text: text, Admin: admin_3, UnicodeProvided: unicode, BackgroundColorProvided: background })
  });

  if (risposta.ok) {
    stato.textContent = "☑ Profilo in fase di creazione, ritorna domani alla Home";
	stato.style.color= "#07ff06";
  } else {
    stato.textContent = "❌ Errore. Riprova o contatta Adam";
	stato.style.color= "#ff0626";
  }
}