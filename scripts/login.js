const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');


const codici = {
  '2674598713': 'u2447',  
  '1756439802': 'u2726',  
  
};


document.getElementById('linking').textContent =
  'Login per ' + (redirect ?? 'null');


function login() {
  const risposta  = document.getElementById('input').value.trim();
  const risultato = document.getElementById('result');

  if (!redirect) {
    risultato.innerHTML = `<p style="color:#ff0802">ATTENZIONE: nessun redirect specificato nel link</p>`;
    return;
  }

  if (codici[risposta]) {
	document.getElementById('timer').style.display = 'flex';
	const unicode = codici[risposta];
	risultato.innerHTML = `<p style="color:#0aff02">[AdminSPACE] Admin code identificato come ${unicode.toUpperCase()}</p>`;
  
	let secondi = 3;
	document.getElementById('timer').textContent = `Redirecting in ${secondi}`;
  
	const intervallo = setInterval(() => {
	secondi--;
	document.getElementById('timer').textContent = `Redirecting in ${secondi}`;
	if (secondi <= 0) {
		clearInterval(intervallo);
		location.href = redirect + '.html?admin=' + unicode;
	}
	}, 1000);
  } else {
	 risultato.innerHTML = `<p style="color:#ff0802">[AdminSPACE] AdminCode sbagliato o non esistente</p>`;
  }
}