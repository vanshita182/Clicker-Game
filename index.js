// =============================
// 🌱 PLANT CLICKER GAME SCRIPT
// =============================

document.addEventListener("DOMContentLoaded", () => {

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
  const clickSound = document.getElementById('click-sound');
  const upgradeSound = document.getElementById('upgrade-sound');
  const backgroundMusic = document.getElementById('background-sound');

  // =============================
  // 🎵 BACKGROUND MUSIC SETUP
  // =============================
  if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // optional volume adjustment
  }

  function startBackgroundMusic() {
    if (backgroundMusic && backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {
        console.log("Background music will start on first user interaction.");
      });
    }
  }

  // =============================
  // 🎵 SOUND HELPER FUNCTIONS
  // =============================
  function playClickSound() {
    if (!clickSound) return;
    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    } catch (err) {
      console.warn("Sound playback error:", err);
    }
  }

  function playUpgradeSound() {
    if (!upgradeSound) return;
    try {
      upgradeSound.currentTime = 0;
      upgradeSound.play().catch(() => {});
    } catch (err) {
      console.warn("Upgrade sound error:", err);
    }
  }

  // =============================
  // 🛒 STORE UPGRADE SYSTEM
  // =============================
  const upgrades = [
    { name: "Water Boost 💧", cost: 50, effect: () => { clickValue *= 2; } }, 
    { name: "Sunlight Upgrade ☀️", cost: 100, effect: () => { autoClickers += 1; } }, 
    { name: "Fertilizer Mix 🌿", cost: 150, effect: () => { clickValue *= 3; } }, 
    { name: "Gardener’s Glove 🧤", cost: 250, effect: () => { clickValue *= 5; autoClickers += 2; } }, 
    { name: "Greenhouse Expansion 🌺", cost: 500, effect: () => { clickValue *= 10; autoClickers += 5; } }
  ];

  function updateDisplay() {
    scoreDisplay.textContent = `Points: ${Math.floor(score)}`;
    renderUpgrades();
    saveGame();
    updatePlantStage();
  }

  function saveGame() {
    localStorage.setItem('score', score);
    localStorage.setItem('clickValue', clickValue);
    localStorage.setItem('autoClickers', autoClickers);
    localStorage.setItem('plantStage', plantStage);
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
      div.onclick = () => buyUpgrade(index, div);
      upgradesContainer.appendChild(div);
    });
  }

  function buyUpgrade(index, div) {
    const upgrade = upgrades[index];
    if (score >= upgrade.cost) {
      startBackgroundMusic();
      playClickSound();
      score -= upgrade.cost;
      upgrade.effect();
      upgrade.cost = Math.floor(upgrade.cost * 2.5);
      div.classList.add('purchased');
      setTimeout(() => div.classList.remove('purchased'), 600);
      updateDisplay();
    }
  }

  // =============================
  // 🌿 BUTTON LOGIC
  // =============================
  clickButton.addEventListener('click', () => {
    startBackgroundMusic();
    playClickSound();
    score += clickValue;
    growPlant();
    updateDisplay();
  });

  resetButton.addEventListener('click', () => {
    startBackgroundMusic();
    playClickSound();
    if (confirm("Are you sure you want to reset the game?")) {
      localStorage.clear();
      score = 0;
      clickValue = 1;
      autoClickers = 0;
      plantStage = 1;
      updateDisplay();
      plant.style.transform = 'scale(1)';
    }
  });

  // =============================
  // 🌱 PLANT GROWTH & PROGRESS
  // =============================
  function growPlant() {
    let scale = 1 + score / 2000;
    if (scale > 3) scale = 3;
    plant.style.transform = `scale(${scale})`;
  }

  function updatePlantStage() {
    const previousStage = plantStage;
    if (score >= 0 && score < 100) plantStage = 1;
    else if (score >= 100 && score < 150) plantStage = 2;
    else if (score >= 150 && score < 200) plantStage = 3;
    else if (score >= 200 && score < 250) plantStage = 4;
    else if (score >= 250) plantStage = 5;

    if (plantStage !== previousStage) {
      playUpgradeSound();
    }

    // Update plant image
    plant.src = `/src/images/plant_stage${plantStage}.png`;

    let nextStageScore = 100;
    if (plantStage === 1) nextStageScore = 100;
    else if (plantStage === 2) nextStageScore = 150;
    else if (plantStage === 3) nextStageScore = 200;
    else if (plantStage === 4) nextStageScore = 250;

    let progress = Math.min((score / nextStageScore) * 100, 100);
    progressFill.style.width = `${progress}%`;
  }

  // =============================
  // 🕓 AUTO-CLICKERS & SAVING
  // =============================
  setInterval(() => {
    if (autoClickers > 0) {
      score += autoClickers;
      growPlant();
      updateDisplay();
    }
  }, 1000);

  setInterval(saveGame, 5000);

  // =============================
  // 🍃 FLOATING LEAVES
  // =============================
  const body = document.body;
  const leafCount = 10;

  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    leaf.textContent = "🍃";
    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.fontSize = 1 + Math.random() * 2 + "em";
    leaf.style.animationDuration = 6 + Math.random() * 9 + "s";
    leaf.style.animationDelay = Math.random() * 10 + "s";
    body.appendChild(leaf);
  }

  // =============================
  // 🚀 INITIAL SETUP
  // =============================
  updateDisplay();
  growPlant();

});