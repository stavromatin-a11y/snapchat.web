const app = document.getElementById("app");

let users = [];
let session = null;

// LocalStorage laden & speichern
function loadState() {
  users = JSON.parse(localStorage.getItem("users")) || [];
  session = JSON.parse(localStorage.getItem("session")) || null;
}

function saveState() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("session", JSON.stringify(session));
}

// Startseite
function showHome() {
  app.className = "start";
  app.innerHTML = `
    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png" class="logo">
    <button id="loginBtn" onclick="showLogin()">Anmelden</button>
    <button id="registerBtn" onclick="showRegister()">Registrieren</button>
  `;
}

// Login-Seite
function showLogin() {
  app.className = "boxed";
  app.innerHTML = `
    <div class="back-arrow" onclick="showHome()">←</div>
    <h2 style="text-align:center; margin-bottom:30px;">Login</h2>
    <div class="input-group">
      <label>NUTZERNAME, E-MAIL ODER HANDYNUMMER</label>
      <input type="text" id="loginEmail" placeholder="">
    </div>
    <div class="input-group">
      <label>PASSWORT</label>
      <input type="password" id="loginPass">
      <span class="eye-icon" onclick="togglePassword()">👁️</span>
    </div>
    <div class="checkbox-group">
      <input type="checkbox" checked>
      <span>Login-Daten auf deinen iCloud-Geräten speichern</span>
    </div>
    <span class="forgot-link">Passwort vergessen?</span>
    <button onclick="login()">Login</button>
  `;
}

// Passwort ein-/ausblenden
function togglePassword() {
  const pass = document.getElementById("loginPass");
  pass.type = pass.type === "password" ? "text" : "password";
}

// Login-Funktion
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  let user = users.find((u) => u.email === email);
  if (!user) {
    const name = email.split("@")[0] || "Anon";
    user = { name, email, password };
    users.push(user);
  }

  session = { name: user.name, email: user.email };

  // Adminrechte für stavroking / Döner
  if (email === "stavroking" && password === "Döner") session.isAdmin = true;
  else session.isAdmin = false;

  saveState();
  showSnapHome();
}

// Registrieren-Seite
function showRegister() {
  app.className = "boxed";
  app.innerHTML = `
    <div class="back-arrow" onclick="showHome()">←</div>
    <h2 style="text-align:center; margin-bottom:30px;">Registrieren</h2>
    <div class="input-group"><label>Name</label><input type="text" id="regName"></div>
    <div class="input-group"><label>Email</label><input type="text" id="regEmail"></div>
    <div class="input-group"><label>Passwort</label><input type="password" id="regPass"></div>
    <button onclick="register()">Registrieren</button>
  `;
}

// Registrieren-Funktion
function register() {
  const name = document.getElementById("regName").value || "Anon";
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;
  if (!email || !password) return alert("Email und Passwort erforderlich");
  if (users.find((u) => u.email === email))
    return alert("User existiert schon");

  users.push({ name, email, password });
  session = { name, email, isAdmin: false };
  saveState();
  showSnapHome();
}

// Snapchat-Feed & Admin
function showSnapHome() {
  app.className = "";
  app.innerHTML = `<h2 style="text-align:center; margin-bottom:20px;">Willkommen ${session.name}!</h2>`;

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.onclick = () => {
    session = null;
    saveState();
    showHome();
  };
  app.appendChild(logoutBtn);

  // Admin-Bereich
  if (session.isAdmin) {
    const adminDiv = document.createElement("div");
    adminDiv.style.marginTop = "20px";
    adminDiv.innerHTML = "<h3>Admin Panel - Benutzerübersicht</h3>";
    users.forEach((user, index) => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `<strong>${user.name}</strong><br/>Email: ${user.email}<br/>
        Passwort: <input type="text" id="pass${index}" value="${user.password}" style="width:120px"/>
        <button onclick="changePassword(${index})">Ändern</button>`;
      adminDiv.appendChild(card);
    });
    app.appendChild(adminDiv);
  }
}

// Passwort ändern (Admin)
function changePassword(index) {
  const newPass = document.getElementById(`pass${index}`).value;
  users[index].password = newPass;
  saveState();
  alert(`Passwort für ${users[index].name} geändert!`);
}

// Init
loadState();
if (session) showSnapHome();
else showHome();
