const content = document.getElementById("content");
const API_BASE = "http://localhost:5000";

/* Home */
function loadHome() {
  content.innerHTML = `
    <h2>Welcome to the Online Voting System</h2>
    <p>This is a secure platform where registered users can cast their votes online.</p>
  `;
}

/* Register */
function loadRegister() {
  content.innerHTML = `
    <h2>User Registration</h2>
    <form onsubmit="registerUser(event)">
      <input id="name" type="text" placeholder="Full Name" required>
      <input id="voterId" type="text" placeholder="Unique Voter ID" required>
      <input id="email" type="email" placeholder="Email" required>
      <input id="password" type="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  `;
}

function registerUser(e) {
  e.preventDefault();

  const data = {
    voter_id: voterId.value,
    name: name.value,
    email: email.value,
    password: password.value
  };

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => alert(res.message))
    .catch(() => alert("Registration failed"));
}

/* Login */
function loadLogin() {
  content.innerHTML = `
    <h2>User Login</h2>
    <form onsubmit="loginUser(event)">
      <input id="loginVoterId" type="text" placeholder="Voter ID" required>
      <input id="loginPassword" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `;
}

function loginUser(e) {
  e.preventDefault();

  fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      voter_id: loginVoterId.value,
      password: loginPassword.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        loadDashboard();
      } else {
        alert(data.message);
      }
    });
}

/* Dashboard */
function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return loadLogin();

  fetch(`${API_BASE}/candidates`)
    .then(res => res.json())
    .then(candidates => {
      let html = `<h2>Voting Dashboard</h2>`;
      candidates.forEach(c => {
        html += `
          <div class="card">
            <h3>${c.name}</h3>
            <p>Party: ${c.party}</p>
            <button onclick="castVote(${user.id}, ${c.id}); this.disabled=true;">
              Vote
            </button>
          </div>
        `;
      });
      content.innerHTML = html;
    });
}

function castVote(userId, candidateId) {
  fetch(`${API_BASE}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, candidate_id: candidateId })
  })
    .then(res => res.json())
    .then(data => alert(data.message));
}

/* Admin */
function loadAdmin() {
  fetch(`${API_BASE}/results`)
    .then(res => res.json())
    .then(results => {
      let html = `<h2>Admin Dashboard</h2>`;
      results.forEach(r => {
        html += `<p>${r.name}: ${r.vote_count} votes</p>`;
      });
      content.innerHTML = html;
    });
}

/* Navigation */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const page = link.getAttribute("href").substring(1);

    if (page === "home") loadHome();
    if (page === "register") loadRegister();
    if (page === "login") loadLogin();
    if (page === "dashboard") loadDashboard();
    if (page === "admin") loadAdmin();
  });
});
