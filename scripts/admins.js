const params_2 = new URLSearchParams(window.location.search);
const admin_2 = params_2.get("admin");

if (admin_2 !== "u2447") {
	document.getElementById('u2447').style.display = 'none';
}
if (admin_2 !== "u2660") {
	document.getElementById('u2660').style.display = 'none';
}
if (admin_2 !== "u2726") {
	document.getElementById('u2726').style.display = 'none';
}

function edit () {
	document.getElementById('edit-section').style.display = 'inline';
}

const infoButton = document.getElementById("un-info-btn");
const infoContainer = document.getElementById("un-info");
const el = document.getElementById("nick-info-btn");
const el2 = document.getElementById("save");
const el3 = document.getElementById("cancel");


infoButton.onclick = (e) => {
    e.stopPropagation();
    infoContainer.classList.toggle("active");
	el.classList.toggle("active");
	el2.classList.toggle("active");
	el3.classList.toggle("active");
};

const info2Button = document.getElementById("nick-info-btn");
const info2Container = document.getElementById("nick-info");

info2Button.onclick = (e) => {
    e.stopPropagation();
    info2Container.classList.toggle("active");
};

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

//save
async function save(e) {
  e.preventDefault();
  document.getElementById('edit-section').style.display = 'none';
  const stato = document.getElementById("stato");
  const unicode = document.getElementById("unicode").value.trim();
  const background = document.getElementById("background").value;
  const nickname = document.getElementById("nickname").value;

  stato.textContent = "❏ Elaborazione...";
  stato.style.color= "#ff9206";

  const risposta = await fetch("https://formspree.io/f/xpqydpyg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Admin: admin_2, Unicode: unicode, Background: background, Nickname: nickname })
  });

  if (risposta.ok) {
    stato.textContent = "☑ Le modifiche sono state inviate al Server di Grejang(C), le modifiche potrebbero impiegare un po ad sincronizzarsi attraverso AdminSPACE";
	stato.style.color= "#07ff06";
  } else {
    stato.textContent = "❌ Errore. Riprova o contatta Adam";
	stato.style.color= "#ff0626";
  }
}

function cancel () {
	document.getElementById('edit-section').style.display = 'none';
}