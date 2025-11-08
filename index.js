// =============================
// 🌱 PLANT CLICKER GAME SCRIPT
// =============================

// Retrieve saved values or initialize defaults
let score = parseFloat(localStorage.getItem('score')) || 0;
let clickValue = parseFloat(localStorage.getItem('clickValue')) || 1;
let autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;
let plantStage = parseInt(localStorage.getItem('plantStage')) || 1;

// Select key UI elements
const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('click-button');
const resetButton = document.getElementById('reset-button');
const upgradesContainer = document.getElementById('upgrades');
const plant = document.getElementById('plant');
const progressFill = document.getElementById('progress-fill');

// Store items with unique upgrades and effects
const upgrades = [
  { name: "Water Boost 💧", cost: 50, effect: () => { clickValue *= 2; } }, 
  { name: "Sunlight Upgrade ☀️", cost: 100, effect: () => { autoClickers += 1; } }, 
  { name: "Fertilizer Mix 🌿", cost: 150, effect: () => { clickValue *= 3; } }, 
  { name: "Gardener’s Glove 🧤", cost: 250, effect: () => { clickValue *= 5; autoClickers += 2; } }, 
  { name: "Greenhouse Expansion 🌺", cost: 500, effect: () => { clickValue *= 10; autoClickers += 5; } }
];

// Update UI elements after each interaction
function updateDisplay() {
  scoreDisplay.textContent = `Points: ${Math.floor(score)}`;
  renderUpgrades();      // Re-render upgrade store
  saveGame();            // Save current game state
  updatePlantStage();    // Update visual stage and progress bar
}

// Save game state in local storage
function saveGame() {
  localStorage.setItem('score', score);
  localStorage.setItem('clickValue', clickValue);
  localStorage.setItem('autoClickers', autoClickers);
  localStorage.setItem('plantStage', plantStage);
}

// Dynamically render upgrade store
function renderUpgrades() {
  upgradesContainer.innerHTML = ''; // Clear previous upgrades
  upgrades.forEach((upgrade, index) => {
    const div = document.createElement('div');
    div.classList.add('upgrade');
    if (score < upgrade.cost) div.classList.add('disabled'); // Disable if not enough points
    div.innerHTML = `
      <span>${upgrade.name}</span>
      <span>${upgrade.cost} pts</span>
    `;
    div.onclick = () => buyUpgrade(index, div); // Handle purchase click
    upgradesContainer.appendChild(div);
  });
}

// Handle upgrade purchase logic
function buyUpgrade(index, div) {
  const upgrade = upgrades[index];
  if (score >= upgrade.cost) {
    score -= upgrade.cost;         // Deduct points
    upgrade.effect();              // Apply upgrade effect
    upgrade.cost = Math.floor(upgrade.cost * 2.5); // Increase cost for next purchase

    // Flash animation for successful purchase
    div.classList.add('purchased');
    setTimeout(() => div.classList.remove('purchased'), 600);

    updateDisplay();
  }
}

// Handle plant growth click
clickButton.addEventListener('click', () => {
  score += clickValue;   // Add points
  growPlant();           // Scale plant visually
  updateDisplay();
});

// Handle full game reset
resetButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to reset the game?")) {
    localStorage.clear();  // Clear all saved data
    score = 0;
    clickValue = 1;
    autoClickers = 0;
    plantStage = 1;
    updateDisplay();
    plant.style.transform = 'scale(1)'; // Reset plant scale
  }
});

// Smooth plant growth scaling animation
function growPlant() {
  let scale = 1 + score / 2000;  // Scale factor based on points
  if (scale > 3) scale = 3;      // Cap max growth
  plant.style.transform = `scale(${scale})`;
}

// Update plant image and growth progress
function updatePlantStage() {
  // Define score thresholds for each stage
  if (score >= 0 && score < 100) plantStage = 1;
  else if (score >= 100 && score < 150) plantStage = 2;
  else if (score >= 150 && score < 200) plantStage = 3;
  else if (score >= 200 && score < 250) plantStage = 4;
  else if (score >= 250) plantStage = 5;

  // Update plant image according to current stage
  plant.src = `plant_stage${plantStage}.png`;

  // Calculate next stage threshold for progress bar
  let nextStageScore = 100;
  if (plantStage === 1) nextStageScore = 100;
  else if (plantStage === 2) nextStageScore = 150;
  else if (plantStage === 3) nextStageScore = 200;
  else if (plantStage === 4) nextStageScore = 250;

  // Update the visual progress bar width
  let progress = Math.min((score / nextStageScore) * 100, 100);
  progressFill.style.width = `${progress}%`;
}

// Auto-clickers generate points passively every second
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    growPlant();
    updateDisplay();
  }
}, 1000);

// Save game periodically every 5 seconds
setInterval(saveGame, 5000);

// Initial setup calls
updateDisplay();
growPlant();

// === Floating Leaves ===
const body = document.body;
const leafCount = 10; // number of leaves on screen

for (let i = 0; i < leafCount; i++) {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");
  leaf.textContent = "🍃";

  // Random horizontal position (0% - 100%)
  leaf.style.left = Math.random() * 100 + "vw";

  // Random size (1em - 3em)
  leaf.style.fontSize = 1 + Math.random() * 2 + "em";

  // Random animation duration (6s - 15s)
  leaf.style.animationDuration = 6 + Math.random() * 9 + "s";

  // Random animation delay (so they don't all fall together)
  leaf.style.animationDelay = Math.random() * 10 + "s";

  body.appendChild(leaf);
}