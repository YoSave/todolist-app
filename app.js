const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('usernameInput');
const greeting = document.getElementById('greeting');

let username = localStorage.getItem('username') || '';

if (username) {
  showMainApp();
}

loginBtn.addEventListener('click', function() {
  username = usernameInput.value.trim();
  if (username !== '') {
    localStorage.setItem('username', username);
    showMainApp();
  } else {
    alert('Masukkan username dulu dong!');
  }
});

function showMainApp() {
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
  greeting.textContent = `Halo, ${username}!`;
}
