document.addEventListener('click', function() {
	const music = document.getElementById('music');
	if (music.paused) music.play();
}, { once: false });
		
const params = new URLSearchParams(window.location.search);
const admin = params.get("admin");
		
if (!admin) {
	document.getElementById('overlay').style.display = 'flex';
} else {
	document.getElementById('admin-icon').src = 'admins/' + admin + '.png';
}
		
function redirect() {
	const pagina = window.location.pathname.split('/').pop().replace('.html', '');
	location.href = 'adminspacelogin.html?redirect=' + pagina;
}

const adminButton = document.getElementById("admin-icon");
const adminContainer = document.getElementById("admin-desc");


adminButton.onclick = (e) => {
    e.stopPropagation();
    adminContainer.classList.toggle("active");
};


document.addEventListener("click", (e) => {
    if (!adminContainer.contains(e.target) && e.target !== adminButton) {
        adminContainer.classList.remove("active");
    }
});

let admintext = "Accesso eseguito da: ";
document.getElementById("admin-name").textContent = admintext + admin;

if (admin) {
  document.querySelectorAll('a.adminlink').forEach(function(link) {
    const href = link.getAttribute('href');
    link.href = href + '?admin=' + admin;
  });
}