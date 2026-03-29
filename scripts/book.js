/**
 * book.js
 * Libro draggabile con cover, 6 pagine, libreria e libri tutorial
 *
 * UTILIZZO:
 *   <div id="book"></div>
 *   <button onclick="apriLibreria()">Libreria</button>
 *   <script src="book.js"></script>
 *
 * AGGIUNGERE LIBRI TUTORIAL:
 *   Aggiungi un oggetto a TUTORIAL_BOOKS seguendo il formato esistente
 */

(function () {

  // ─── CONFIGURAZIONE ────────────────────────────────────────────────────────
  const TOTAL_PAGES    = 6;
  const MAX_BOOKS      = 10;
  const BOOKLIST_KEY   = 'adminspace_booklist'; // lista dei libri personali
  const TEXTURE_COVER  = 'images/book_cover.png';
  const TEXTURE_PAGE   = 'images/book_page.png';

  // ─── LIBRI TUTORIAL ───────────────────────────────────────────────────────
  // Aggiungi qui i tuoi libri firmati — non modificabili dagli utenti
  const TUTORIAL_BOOKS = [
    {
      title:  'Guida alle consoles',
      author: 'U+2447 (⑇)',
      pages: [
        'Una console vi permette di eseguire comandi, per un comando chiedete a un Admin',
        '',
        '',
        '',
        '',
        '',
      ]
    }
  ];

  // ─── CSS ──────────────────────────────────────────────────────────────────
  const css = `
    /* ── LIBRO ── */
    #book {
      position: fixed;
      top: 50%;
      left: 20%;
      transform: translate(-50%, -50%);
      width: 220px;
      z-index: 8888;
      user-select: none;
    }
    #book-inner {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #book-cover-img {
      width: 100%;
      cursor: pointer;
      image-rendering: pixelated;
      display: block;
    }

    /* Cover screen */
    #book-cover-screen {
      display: none;
      flex-direction: column;
      align-items: center;
      width: 100%;
      position: absolute;
      top: 0; left: 0;
    }
    #book-cover-screen.open { display: flex; }

    #book-cover-page-bg {
      position: relative;
      width: 100%;
    }
    #book-cover-page-bg > img {
      width: 100%;
      image-rendering: pixelated;
      display: block;
    }
    #book-title-input {
      position: absolute;
      top: 20%;
      left: 8%;
      width: 84%;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(0,0,0,0.3);
      outline: none;
      font-family: 'VoidFont', monospace;
      font-size: 13px;
      color: black;
      text-align: center;
    }
    #book-author-label {
      position: absolute;
      top: 38%;
      left: 0; right: 0;
      text-align: center;
      font-family: 'VoidFont', monospace;
      font-size: 10px;
      color: #555;
    }
    #book-cover-buttons {
      position: relative;
      bottom: 36px;
      gap: 4px;
      width: 100%;
    }
    #book-cover-open {
	  position: relative;
      flex: 1;
      border: 2px solid #555;
      padding: 6px 0;
      cursor: pointer;
      background: #c6c6c6;
      font-family: 'VoidFont', monospace;
      font-size: 13px;
      color: black;
	  width: 38%;
	  left: 5px;
    }
    #book-cover-open:hover  { background: #d4d4d4; }
    #book-cover-open:active { background: #aaaaaa; }
    #book-reset {
	  position: relative;
      flex: 1;
      border: 2px solid #882222;
      padding: 6px 0;
      cursor: pointer;
      background: #c66;
      font-family: 'VoidFont', monospace;
      font-size: 13px;
      color: white;
	  width: 38%;
	  right: -15px;
    }
    #book-reset:hover  { background: #d47777; }
    #book-reset:active { background: #aa4444; }

    /* Pagine */
    #book-content {
      display: none;
      flex-direction: column;
      align-items: center;
      width: 100%;
      position: absolute;
      top: 0; left: 0;
    }
    #book-content.open { display: flex; }

    #book-page-bg {
      position: relative;
      width: 100%;
    }
    #book-page-bg > img {
      width: 100%;
      image-rendering: pixelated;
      display: block;
    }
    #book-textarea {
      position: absolute;
      top: 12%; left: 8%;
      width: 84%; height: 72%;
      background: transparent;
      border: none; outline: none; resize: none;
      font-family: 'VoidFont', monospace;
      font-size: 11px;
      color: black;
      line-height: 1.5;
      overflow: hidden;
    }
    #book-textarea[readonly] { cursor: default; }
    #book-page-num {
      font-family: 'VoidFont', monospace;
      font-size: 10px;
      color: black;
      position: absolute;
      top: 4%; right: 6%;
      pointer-events: none;
    }
    #book-nav {
      position: relative;
      bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 4px 40px;
    }
    #book-nav button {
      background: none; border: none;
      cursor: pointer; padding: 0;
      image-rendering: pixelated;
    }
    .left  { position: relative; left:  28px; }
    .right { position: relative; right: 28px; }
    #book-prev:hover img { content: url('images/arrow_disabled.png'); }
    #book-next:hover img { content: url('images/arrow_disabled.png'); }
    #book-prev:disabled img { content: url('images/arrow.png'); }
    #book-next:disabled img { content: url('images/arrow.png'); }
    #book-done {
      width: 100%;
      border: 2px solid #555;
      padding: 6px 0;
      cursor: pointer;
      background: #c6c6c6;
      font-family: 'VoidFont', monospace;
      font-size: 14px;
      color: black;
      display: block;
      position: relative;
      bottom: 36px;
    }
    #book-done:hover  { background: #d4d4d4; }
    #book-done:active { background: #aaaaaa; }

    #book-titlebar {
	  touch-action: none;
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 32px;
      cursor: grab;
      z-index: 1;
    }
    #book-titlebar.grabbing { cursor: grabbing; }

    /* ── LIBRERIA ── */
    #book-library {
      display: none;
      position: fixed;
      top: 50%; left: 80%;
      transform: translate(-50%, -50%);
      width: 320px;
      max-height: 480px;
      background: #1a1a1a;
      border: 1px solid #d60000;
      border-radius: 8px;
      z-index: 9000;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }
    #book-library.open { display: flex; }

    #book-library-titlebar {
		touch-action: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #333;
      cursor: grab;
    }
    #book-library-titlebar.grabbing { cursor: grabbing; }
    #book-library-title {
      font-family: 'VoidFont', monospace;
      font-size: 13px;
      letter-spacing: 2px;
      color: #fff;
    }
    #book-library-close {
      background: none;
      border: 1px solid #444;
      color: #aaa;
      border-radius: 4px;
      width: 24px; height: 24px;
      cursor: pointer;
      font-size: 14px;
    }
    #book-library-close:hover { color: #fff; border-color: #888; }

    #book-library-body {
      overflow-y: auto;
      padding: 12px;
      flex: 1;
    }
    #book-library-body::-webkit-scrollbar { width: 4px; }
    #book-library-body::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

    .book-lib-section {
      font-family: 'VoidFont', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: #d60000;
      margin: 8px 0 6px;
      text-transform: uppercase;
    }

    .book-lib-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background: #222;
      border-radius: 4px;
      margin-bottom: 4px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: border 0.15s;
    }
    .book-lib-item:hover { border-color: #d60000; }
    .book-lib-item-title {
      font-family: 'VoidFont', monospace;
      font-size: 12px;
      color: #fff;
    }
    .book-lib-item-delete {
      background: none;
      border: none;
      color: #c66;
      cursor: pointer;
      font-size: 14px;
      padding: 0 4px;
    }
    .book-lib-item-delete:hover { color: #ff4444; }

    .book-lib-tutorial {
      cursor: default;
    }
    .book-lib-tutorial .book-lib-item-title { color: #aaa; }
    .book-lib-tutorial-author {
      font-family: 'VoidFont', monospace;
      font-size: 9px;
      color: #555;
      margin-left: 6px;
    }

    #book-library-new {
      width: 100%;
      border: none;
      padding: 10px;
      background: #d60000;
      color: #fff;
      font-family: 'VoidFont', monospace;
      font-size: 13px;
      cursor: pointer;
      border-top: 1px solid #333;
      flex-shrink: 0;
    }
    #book-library-new:hover  { background: #ec3434; }
    #book-library-new:disabled { background: #333; color: #666; cursor: default; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── HTML LIBRO ───────────────────────────────────────────────────────────
  const book = document.getElementById('book');
  book.innerHTML = `
    <div id="book-inner">
      <div id="book-titlebar"></div>
      <img id="book-cover-img" src="${TEXTURE_COVER}" alt="Libro">

      <!-- Cover screen -->
      <div id="book-cover-screen">
        <div id="book-cover-page-bg">
          <img src="${TEXTURE_PAGE}" alt="Cover">
          <input id="book-title-input" type="text" maxlength="30" placeholder="Titolo...">
          <span id="book-author-label"></span>
        </div>
        <div id="book-cover-buttons">
          <button id="book-cover-open">Apri</button>
          <button id="book-reset">Reset</button>
        </div>
      </div>

      <!-- Pagine -->
      <div id="book-content">
        <div id="book-page-bg">
          <span id="book-page-num">Page 1 of ${TOTAL_PAGES}</span>
          <img src="${TEXTURE_PAGE}" alt="Pagina">
          <textarea id="book-textarea" maxlength="300" placeholder="Scrivi qui..."></textarea>
        </div>
        <div id="book-nav">
          <button id="book-prev" class="left"><img src="images/arrow.png" width="48"></button>
          <button id="book-next" class="right"><img src="images/arrow.png" width="48"></button>
        </div>
        <button id="book-done">Done</button>
      </div>
    </div>
  `;

  // ─── HTML LIBRERIA ────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="book-library">
      <div id="book-library-titlebar">
        <span id="book-library-title">LIBRERIA</span>
        <button id="book-library-close">✕</button>
      </div>
      <div id="book-library-body"></div>
      <button id="book-library-new">+ Nuovo libro</button>
    </div>
  `);

  // ─── STATO ────────────────────────────────────────────────────────────────
  let currentPage    = 0;
  let isOpen         = false;         // cover screen aperta
  let pagesOpen      = false;         // pagine aperte
  let currentBookKey = null;          // STORAGE_KEY del libro attivo
  let isReadonly     = false;         // libro tutorial = sola lettura
  let currentTutorial= null;          // indice tutorial attivo

  // Lista libri personali: [{key, title}]
  let booklist = JSON.parse(localStorage.getItem(BOOKLIST_KEY) || '[]');

  // Pagine libro attivo
  let pages = [];

  // ─── ELEMENTI ─────────────────────────────────────────────────────────────
  const coverImg      = document.getElementById('book-cover-img');
  const coverScreen   = document.getElementById('book-cover-screen');
  const bookContent   = document.getElementById('book-content');
  const textarea      = document.getElementById('book-textarea');
  const pageNum       = document.getElementById('book-page-num');
  const btnPrev       = document.getElementById('book-prev');
  const btnNext       = document.getElementById('book-next');
  const btnDone       = document.getElementById('book-done');
  const titleInput    = document.getElementById('book-title-input');
  const authorLabel   = document.getElementById('book-author-label');
  const btnCoverOpen  = document.getElementById('book-cover-open');
  const btnReset      = document.getElementById('book-reset');
  const library       = document.getElementById('book-library');
  const libraryBody   = document.getElementById('book-library-body');
  const btnLibNew     = document.getElementById('book-library-new');
  const btnLibClose   = document.getElementById('book-library-close');

  // ─── FUNZIONI LIBRO ───────────────────────────────────────────────────────

  function salva() {
    if (isReadonly || !currentBookKey) return;
    pages[currentPage] = textarea.value;
    localStorage.setItem(currentBookKey, JSON.stringify({ pages }));
    // aggiorna titolo nella booklist
    const entry = booklist.find(b => b.key === currentBookKey);
    if (entry) {
      entry.title = titleInput.value || 'Senza titolo';
      localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
    }
  }

  function aggiornaNav() {
    pageNum.textContent = 'Page ' + (currentPage + 1) + ' of ' + TOTAL_PAGES;
    btnPrev.disabled    = currentPage === 0;
    btnNext.disabled    = currentPage === TOTAL_PAGES - 1;
  }

  function caricaPagina(idx) {
    salva();
    currentPage    = idx;
    textarea.value = pages[currentPage] || '';
    aggiornaNav();
  }

  function apriCover(bookKey, tutorialIdx = null) {
    // Chiudi tutto prima
    coverScreen.classList.remove('open');
    bookContent.classList.remove('open');
    pagesOpen = false;

    if (tutorialIdx !== null) {
      // Libro tutorial
      isReadonly      = true;
      currentTutorial = tutorialIdx;
      currentBookKey  = null;
      const tb = TUTORIAL_BOOKS[tutorialIdx];
      pages           = tb.pages.slice(0, TOTAL_PAGES);
      while (pages.length < TOTAL_PAGES) pages.push('');
      titleInput.value    = tb.title;
      titleInput.readOnly = true;
      authorLabel.textContent = 'by ' + tb.author;
      btnReset.style.display  = 'none';
    } else {
      // Libro personale
      isReadonly      = false;
      currentTutorial = null;
      currentBookKey  = bookKey;
      titleInput.readOnly = false;
      btnReset.style.display = '';
      const saved = JSON.parse(localStorage.getItem(bookKey) || '{}');
      pages = saved.pages || Array(TOTAL_PAGES).fill('');
      const entry = booklist.find(b => b.key === bookKey);
      titleInput.value    = entry ? entry.title : 'Senza titolo';
      authorLabel.textContent = '';
    }

    currentPage = 0;
    isOpen = true;
    coverScreen.classList.add('open');
  }

  function apriPagine() {
    coverScreen.classList.remove('open');
    pagesOpen = true;
    bookContent.classList.add('open');
    textarea.readOnly = isReadonly;
    textarea.value    = pages[currentPage] || '';
    aggiornaNav();
  }

  function chiudiTutto() {
    if (!isReadonly) salva();
    isOpen    = false;
    pagesOpen = false;
    coverScreen.classList.remove('open');
    bookContent.classList.remove('open');
  }

  // ─── EVENTI LIBRO ─────────────────────────────────────────────────────────
  coverImg.addEventListener('click', () => {
  if (booklist.length > 0) {
    apriCover(booklist[0].key);
  } else {
    // Nessun libro — crea uno automaticamente
    const key   = 'adminspace_book_' + Date.now();
    const entry = { key, title: 'Senza titolo' };
    booklist.push(entry);
    localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
    localStorage.setItem(key, JSON.stringify({ pages: Array(TOTAL_PAGES).fill('') }));
    apriCover(key);
  }
});

  btnCoverOpen.addEventListener('click', apriPagine);

  btnReset.addEventListener('click', () => {
    if (!confirm('Resettare il libro? Titolo e pagine saranno cancellati.')) return;
    pages = Array(TOTAL_PAGES).fill('');
    titleInput.value = '';
    if (currentBookKey) {
      localStorage.setItem(currentBookKey, JSON.stringify({ pages }));
      const entry = booklist.find(b => b.key === currentBookKey);
      if (entry) {
        entry.title = 'Senza titolo';
        localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
      }
    }
  });

  titleInput.addEventListener('input', () => {
    if (!currentBookKey) return;
    const entry = booklist.find(b => b.key === currentBookKey);
    if (entry) {
      entry.title = titleInput.value || 'Senza titolo';
      localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
    }
  });

  btnDone.addEventListener('click', function() {
  if (!isReadonly) salva();
  pagesOpen = false;
  bookContent.classList.remove('open');
  coverScreen.classList.add('open'); // torna alla cover screen invece di chiudere tutto
});
  textarea.addEventListener('input', salva);
  textarea.addEventListener('blur',  salva);
  btnPrev.addEventListener('click',  () => caricaPagina(currentPage - 1));
  btnNext.addEventListener('click',  () => caricaPagina(currentPage + 1));

  // ─── DRAG LIBRO ───────────────────────────────────────────────────────────
  const titlebar = document.getElementById('book-titlebar');
  let isDragging = false, offsetX = 0, offsetY = 0, dragMoved = false;

  titlebar.addEventListener('mousedown', function (e) {
    dragMoved = false;
    const rect = book.getBoundingClientRect();
    book.style.transform = 'none';
    book.style.left = rect.left + 'px';
    book.style.top  = rect.top  + 'px';
    isDragging = true;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    titlebar.classList.add('grabbing');
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    dragMoved = true;
    book.style.left = (e.clientX - offsetX) + 'px';
    book.style.top  = (e.clientY - offsetY) + 'px';
  });

  titlebar.addEventListener('mouseup', function () {
    if (!dragMoved) {
      if (pagesOpen)     { chiudiTutto(); }
      else if (isOpen)   { chiudiTutto(); }
    }
    isDragging = false;
    titlebar.classList.remove('grabbing');
  });

  window.addEventListener('mouseup', function () {
    isDragging = false;
    titlebar.classList.remove('grabbing');
  });
  
  titlebar.addEventListener('touchstart', function(e) {
  const t = e.touches[0];
  dragMoved = false;
  const rect = book.getBoundingClientRect();
  book.style.transform = 'none';
  book.style.left = rect.left + 'px';
  book.style.top  = rect.top  + 'px';
  isDragging = true;
  offsetX = t.clientX - rect.left;
  offsetY = t.clientY - rect.top;
} );

titlebar.addEventListener('touchmove', function(e) {
	 e.preventDefault();
  if (!isDragging) return;
  const t = e.touches[0];
  dragMoved = true;
  book.style.left = (t.clientX - offsetX) + 'px';
  book.style.top  = (t.clientY - offsetY) + 'px';
});

titlebar.addEventListener('touchend', function() {
  if (!dragMoved) {
    if (pagesOpen) chiudiTutto();
    else if (isOpen) chiudiTutto();
  }
  isDragging = false;
});

  // ─── LIBRERIA ─────────────────────────────────────────────────────────────

  function renderLibreria() {
    libraryBody.innerHTML = '';

    // Sezione libri personali
    const secPersonale = document.createElement('div');
    secPersonale.className = 'book-lib-section';
    secPersonale.textContent = 'I tuoi libri';
    libraryBody.appendChild(secPersonale);

    if (booklist.length === 0) {
      const vuoto = document.createElement('div');
      vuoto.style.cssText = 'font-family:VoidFont,monospace;font-size:11px;color:#555;padding:6px 0;';
      vuoto.textContent = 'Nessun libro. Creane uno!';
      libraryBody.appendChild(vuoto);
    }

    booklist.forEach(function (entry) {
      const item = document.createElement('div');
      item.className = 'book-lib-item';

      const titleEl = document.createElement('span');
      titleEl.className = 'book-lib-item-title';
      titleEl.textContent = entry.title || 'Senza titolo';

      const delBtn = document.createElement('button');
      delBtn.className = 'book-lib-item-delete';
      delBtn.textContent = '✕';
      delBtn.title = 'Elimina';
      delBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!confirm('Eliminare "' + (entry.title || 'Senza titolo') + '"?')) return;
        localStorage.removeItem(entry.key);
        booklist = booklist.filter(b => b.key !== entry.key);
        localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
        renderLibreria();
      });

      item.appendChild(titleEl);
      item.appendChild(delBtn);
      item.addEventListener('click', function () {
        apriCover(entry.key);
        chiudiLibreria();
      });

      libraryBody.appendChild(item);
    });

    // Sezione tutorial
    if (TUTORIAL_BOOKS.length > 0) {
      const secTutorial = document.createElement('div');
      secTutorial.className = 'book-lib-section';
      secTutorial.textContent = 'Libri firmati';
      libraryBody.appendChild(secTutorial);

      TUTORIAL_BOOKS.forEach(function (tb, idx) {
        const item = document.createElement('div');
        item.className = 'book-lib-item book-lib-tutorial';

        const titleEl = document.createElement('span');
        titleEl.className = 'book-lib-item-title';
        titleEl.textContent = tb.title;

        const authorEl = document.createElement('span');
        authorEl.className = 'book-lib-tutorial-author';
        authorEl.textContent = tb.author;

        item.appendChild(titleEl);
        item.appendChild(authorEl);
        item.addEventListener('click', function () {
          apriCover(null, idx);
          chiudiLibreria();
        });

        libraryBody.appendChild(item);
      });
    }

    // Disabilita "nuovo libro" se al limite
    btnLibNew.disabled = booklist.length >= MAX_BOOKS;
    btnLibNew.textContent = booklist.length >= MAX_BOOKS
      ? 'Limite raggiunto (' + MAX_BOOKS + ')'
      : '+ Nuovo libro';
  }

  function apriLibreria() {
    renderLibreria();
    library.classList.add('open');
  }

  function chiudiLibreria() {
    library.classList.remove('open');
  }

  btnLibClose.addEventListener('click', chiudiLibreria);

  btnLibNew.addEventListener('click', function () {
    if (booklist.length >= MAX_BOOKS) return;
    const key   = 'adminspace_book_' + Date.now();
    const entry = { key, title: 'Senza titolo' };
    booklist.push(entry);
    localStorage.setItem(BOOKLIST_KEY, JSON.stringify(booklist));
    localStorage.setItem(key, JSON.stringify({ pages: Array(TOTAL_PAGES).fill('') }));
    renderLibreria();
    apriCover(key);
    chiudiLibreria();
  });

  // ─── DRAG LIBRERIA ────────────────────────────────────────────────────────
  const libTitlebar = document.getElementById('book-library-titlebar');
  let libDragging = false, libOffX = 0, libOffY = 0;

  libTitlebar.addEventListener('mousedown', function (e) {
    const rect = library.getBoundingClientRect();
    library.style.transform = 'none';
    library.style.left = rect.left + 'px';
    library.style.top  = rect.top  + 'px';
    libDragging = true;
    libOffX = e.clientX - rect.left;
    libOffY = e.clientY - rect.top;
    libTitlebar.classList.add('grabbing');
  });

  window.addEventListener('mousemove', function (e) {
    if (!libDragging) return;
    library.style.left = (e.clientX - libOffX) + 'px';
    library.style.top  = (e.clientY - libOffY) + 'px';
  });

  window.addEventListener('mouseup', function () {
    libDragging = false;
    libTitlebar.classList.remove('grabbing');
  });
  
  libTitlebar.addEventListener('touchstart', function(e) {
  const t = e.touches[0];
  const rect = library.getBoundingClientRect();
  library.style.transform = 'none';
  library.style.left = rect.left + 'px';
  library.style.top  = rect.top  + 'px';
  libDragging = true;
  libOffX = t.clientX - rect.left;
  libOffY = t.clientY - rect.top;
});

libTitlebar.addEventListener('touchmove', function(e) {
	 e.preventDefault();
  if (!libDragging) return;
  const t = e.touches[0];
  library.style.left = (t.clientX - libOffX) + 'px';
  library.style.top  = (t.clientY - libOffY) + 'px';
});

libTitlebar.addEventListener('touchend', function() {
  libDragging = false;
});

  // ─── ESPONI apriLibreria GLOBALMENTE ──────────────────────────────────────
  window.apriLibreria = apriLibreria;
  

})();
