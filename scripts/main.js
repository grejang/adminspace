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