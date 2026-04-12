const params   = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');

document.getElementById('linking').textContent =
  'Login per ' + (redirect ?? 'null');

// Carica gli admin codes da admins.json
fetch('admins.json')
  .then(r => r.json())
  .then(data => {

    // Costruisce la mappa code → unicode
    const codici = {};
    data.admins.forEach(a => {
      codici[a.code] = a.unicode;
    });

    // Abilita il pulsante solo dopo che i codici sono caricati
    document.getElementById('btn-login').disabled = false;

    window.login = function () {
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
    };

  })
  .catch(() => {
    document.getElementById('result').innerHTML =
      `<p style="color:#ff0802">ERRORE: impossibile caricare admins.json</p>`;
  });
