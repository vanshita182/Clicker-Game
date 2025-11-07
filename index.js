let score = parseFloat(localStorage.getItem('score')) || 0;
let clickValue = parseFloat(localStorage.getItem('clickValue')) || 1;
let autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('click-button');
const upgradesContainer = document.getElementById('upgrades');

const upgrades = [
  { name: "Double Click Power", cost: 50, effect: () => { clickValue *= 2; } },
  { name: "Auto Clicker", cost: 100, effect: () => { autoClickers++; } },
  { name: "Mega Click", cost: 500, effect: () => { clickValue *= 5; } },
];

function updateDisplay() {
  scoreDisplay.textContent = `Points: ${Math.floor(score)}`;
  renderUpgrades();
  saveGame();
}

function saveGame() {
  localStorage.setItem('score', score);
  localStorage.setItem('clickValue', clickValue);
  localStorage.setItem('autoClickers', autoClickers);
}

function renderUpgrades() {
  upgradesContainer.innerHTML = '';
  upgrades.forEach((upgrade, index) => {
    const div = document.createElement('div');
    div.classList.add('upgrade');
    if (score < upgrade.cost) div.classList.add('disabled');
    div.innerHTML = `
      <span>${upgrade.name}</span>
      <span>${upgrade.cost} pts</span>
    `;
    div.onclick = () => buyUpgrade(index);
    upgradesContainer.appendChild(div);
  });
}

function buyUpgrade(index) {
  const upgrade = upgrades[index];
  if (score >= upgrade.cost) {
    score -= upgrade.cost;
    upgrade.effect();
    upgrade.cost = Math.floor(upgrade.cost * 2.5);
    updateDisplay();
  }
}

clickButton.addEventListener('click', () => {
  score += clickValue;
  updateDisplay();
});

// Auto clicker income
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateDisplay();
  }
}, 1000);

// Auto-save progress
setInterval(saveGame, 5000);

updateDisplay();
