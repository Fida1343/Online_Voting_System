const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("nav a");

const startVoteBtn = document.getElementById("startVoteBtn");
const voterIdForm = document.getElementById("voterIdForm");
const voterIdInput = document.getElementById("voterIdInput");
const voterIdError = document.getElementById("voterIdError");
const candidateList = document.getElementById("candidateList");
const resultsStats = document.getElementById("resultsStats");
const resultsContainer = document.getElementById("resultsContainer");

/* Data */
const candidates = [
  { id: 1, name: "Anil Kumar", party: "Party A" },
  { id: 2, name: "Pooja Gupta", party: "Party B" },
  { id: 3, name: "Rahul Mehta", party: "Party C" }
];

/*Page Navigation*/
function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

startVoteBtn.addEventListener("click", () => {
  showPage("vote");
});
voterIdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const voterId = voterIdInput.value.trim();
  voterIdError.textContent = "";
  
  //Validation
  if (!voterId) {
    voterIdError.textContent = "Voter ID is required";
    return;
  }
  if (voterId.length < 5) {
    voterIdError.textContent = "Voter ID must be at least 5 characters";
    return;
  }

  //Check if already voted
  const votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || [];  
  if (votedUsers.includes(voterId)) {
    voterIdError.textContent = "You have already voted with this Voter ID";
    setTimeout(() => {
      showResults();
      showPage("results");
    }, 1500);
    return;
  }
  //Store current voter
  localStorage.setItem("currentVoter", voterId);
  loadCandidates();
});

/*Load Candidates*/
function loadCandidates() {
  candidateList.innerHTML = "<h3>Select Your Candidate</h3>";
  candidates.forEach(candidate => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${candidate.name}</h3>
        <p>${candidate.party}</p>
      </div>
      <button class="btn btn-primary">Vote</button>
    `;
    
    card.querySelector("button").addEventListener("click", () => {
      castVote(candidate);
    });
    candidateList.appendChild(card);
  });
}

/*Cast Vote*/
function castVote(candidate) {
  const confirmed = confirm(`Vote for ${candidate.name} (${candidate.party})?\n\nThis cannot be undone.`);
  
  if (!confirmed) return;
  const voterId = localStorage.getItem("currentVoter");
  if (!voterId) return;
  
  //Get votes and voted users
  let votes = JSON.parse(localStorage.getItem("votes")) || {};
  let votedUsers = JSON.parse(localStorage.getItem("votedUsers")) || [];

  //Record vote
  votes[candidate.id] = (votes[candidate.id] || 0) + 1;
  votedUsers.push(voterId);
  
  //Save to localStorage
  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("votedUsers", JSON.stringify(votedUsers));
  localStorage.removeItem("currentVoter");
  
  //Clear form
  voterIdInput.value = "";
  candidateList.innerHTML = "";
  alert("Thank you! Your vote has been recorded.");
  showResults();
  showPage("results");
}

/*Show Results*/
function showResults() {
  const votes = JSON.parse(localStorage.getItem("votes")) || {};
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  
  //Show total votes
  resultsStats.innerHTML = `
    <h3>Total Votes Cast</h3>
    <div class="total-votes">${totalVotes}</div>
  `;
  resultsContainer.innerHTML = "";
  
  //Empty state
  if (totalVotes === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <h3>No votes cast yet</h3>
        <p>Be the first to vote!</p>
      </div>
    `;
    return;
  }
  
  //Show results
  candidates.forEach(candidate => {
    const voteCount = votes[candidate.id] || 0;
    const percentage = ((voteCount / totalVotes) * 100).toFixed(1);
    
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
      <div class="result-header">
        <h3>${candidate.name}</h3>
        <span class="result-count">${voteCount} votes</span>
      </div>
      <p class="result-party">${candidate.party}</p>
      <div class="result-bar">
        <div class="result-fill" style="width: ${percentage}%">
          ${percentage > 10 ? percentage + '%' : ''}
        </div>
      </div>
      <p class="result-percentage">${percentage}% of total votes</p>
    `;
    
    resultsContainer.appendChild(resultItem);
  });
}

/*Navigation*/
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page === "results") {
      showResults();
    }
    
    showPage(page);
  });
});

showPage("home");
localStorage.removeItem("currentVoter");
