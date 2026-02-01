/**
 * Config & Constants
 */
const CONFIG = {
    baseHp: 200,
    hpGrowthFactor: 1.2, // Monster HP grows by 20% each level instead of 100%
    clickSoundVolume: 0.1,
    autoSaveInterval: 5000,
};

/**
 * Game State
 */
const state = {
    score: 0,
    damage: 1,
    multiplier: 1,
    stage: 1,
    monsterHp: CONFIG.baseHp,
    maxHp: CONFIG.baseHp,
    currentMonsterIndex: 0,

    // Upgrades
    autoDamage: false,
    autoDamageValue: 0,

    // Costs
    costs: {
        damage: 10,
        double: 50,
        auto: 100
    }
};

const monsters = [
    'img/monster1.png', 'img/monster2.png', 'img/monster3.png',
    'img/monster4.png', 'img/monster5.png', 'img/monster6.png',
    'img/monster7.png', 'img/monster8.png'
];

/**
 * DOM Elements
 */
const UI = {
    loader: document.getElementById('loader'),
    screens: {
        game: document.getElementById('game-screen'),
        shop: document.getElementById('shop-screen'),
    },
    displays: {
        score: document.getElementById('score'),
        shopScore: document.getElementById('shopScore'),
        stage: document.getElementById('stage'),
        hpBar: document.getElementById('hpBar'),
        hpText: document.getElementById('hpText'),
        monster: document.getElementById('monster'),

        // Shop Values
        damageVal: document.getElementById('damageVal'),
        multiplierVal: document.getElementById('multiplierVal'),
        autoStatus: document.getElementById('autoDamageStatus'),

        // Costs
        costDamage: document.getElementById('costUpgradeDamage'),
        costDouble: document.getElementById('costDoubleDamage'),
        costAuto: document.getElementById('costAutoDamage'),
    },
    buttons: {
        toShop: document.getElementById('toShopButton'),
        backToGame: document.getElementById('backToGameButton'),
        settings: document.getElementById('settingsButton'),

        upgradeDamage: document.getElementById('btnUpgradeDamage'),
        doubleDamage: document.getElementById('btnDoubleDamage'),
        autoDamage: document.getElementById('btnAutoDamage'),

        resetConfirm: document.getElementById('confirmResetButton'),
        resetCancel: document.getElementById('cancelResetButton'),
    },
    modal: document.getElementById('settingsModal'),
    closeModal: document.querySelector('.close-modal')
};

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initEventListeners();

    // Simulate loading
    setTimeout(() => {
        UI.loader.classList.add('hidden');
        UI.screens.game.classList.remove('hidden');
    }, 1500);

    // Game Loop
    setInterval(gameLoop, 1000);
    setInterval(saveGame, CONFIG.autoSaveInterval);

    render();
});

function initEventListeners() {
    // Navigation
    UI.buttons.toShop.addEventListener('click', () => switchScreen('shop'));
    UI.buttons.backToGame.addEventListener('click', () => switchScreen('game'));

    // Game Interactions
    UI.displays.monster.addEventListener('click', (e) => {
        const dmg = calculateClickDamage();
        damageMonster(dmg);
        playClickSound(); // from sounds.js
        createFloatingText(e.clientX, e.clientY, `+${dmg}`);

        // Visual effect
        UI.displays.monster.classList.remove('hit');
        void UI.displays.monster.offsetWidth; // trigger reflow
        UI.displays.monster.classList.add('hit');
    });

    // Upgrades
    UI.buttons.upgradeDamage.addEventListener('click', () => buyUpgrade('damage'));
    UI.buttons.doubleDamage.addEventListener('click', () => buyUpgrade('double'));
    UI.buttons.autoDamage.addEventListener('click', () => buyUpgrade('auto'));

    // Settings
    UI.buttons.settings.addEventListener('click', () => UI.modal.style.display = 'flex');
    UI.closeModal.addEventListener('click', () => UI.modal.style.display = 'none');
    UI.buttons.resetCancel.addEventListener('click', () => UI.modal.style.display = 'none');
    UI.buttons.resetConfirm.addEventListener('click', () => {
        resetGame();
        UI.modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target == UI.modal) UI.modal.style.display = 'none';
    });
}

/**
 * Core Logic
 */
function calculateClickDamage() {
    return state.damage * state.multiplier;
}

function damageMonster(amount) {
    state.monsterHp -= amount;

    if (state.monsterHp <= 0) {
        killMonster();
    } else {
        renderHp();
    }
}

function killMonster() {
    state.monsterHp = 0;
    renderHp();

    // Reward
    const reward = Math.floor(state.maxHp / 10) * state.multiplier; // Dynamic reward based on HP
    const actualReward = Math.max(10 * state.stage, reward); // Guarantees min reward
    addScore(actualReward); // Bonus for kill

    // Visual Death
    UI.displays.monster.classList.add('monster-death');
    playDestroySound(); // from sounds.js

    setTimeout(() => {
        nextStage();
        UI.displays.monster.classList.remove('monster-death');
    }, 450);
}

function nextStage() {
    state.stage++;
    state.currentMonsterIndex = (state.currentMonsterIndex + 1) % monsters.length;

    // New HP Formula: Health * 1.2 each level
    state.maxHp = Math.round(state.maxHp * CONFIG.hpGrowthFactor);
    state.monsterHp = state.maxHp;

    render();
}

function addScore(amount) {
    state.score += amount;
    renderScore();
    updateShopButtons();
}

function gameLoop() {
    if (state.autoDamage && state.monsterHp > 0) {
        // Auto damage is 10% of click damage or at least 1
        const dps = Math.max(1, Math.floor(calculateClickDamage() * 0.5));
        damageMonster(dps);
        addScore(dps); // Auto damage gives points too

        // Show floating text slightly randomized position
        const rect = UI.displays.monster.getBoundingClientRect();
        const randX = rect.left + Math.random() * rect.width;
        const randY = rect.top + Math.random() * rect.height;
        if (!document.hidden && !UI.screens.game.classList.contains('hidden')) {
            createFloatingText(randX, randY, `⚔️ ${dps}`);
        }
    }
}

/**
 * Shop System
 */
function buyUpgrade(type) {
    const cost = state.costs[type];

    if (state.score >= cost) {
        state.score -= cost;
        playUpgradeSound(); // from sounds.js

        switch (type) {
            case 'damage':
                state.damage++;
                state.costs.damage = Math.round(state.costs.damage * 1.5);
                break;
            case 'double':
                state.multiplier *= 2;
                state.costs.double *= 5;
                state.costs.damage *= 2; // Balance: Base damage cost increases if you double logic
                break;
            case 'auto':
                state.autoDamage = true;
                state.costs.auto = 9999999; // Maxed out (one time purchase for now)
                document.getElementById('btnAutoDamage').textContent = 'MAX';
                document.getElementById('btnAutoDamage').disabled = true;
                break;
        }

        render();
        updateShopButtons();
    }
}

/**
 * Visual Effects
 */
function createFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.classList.add('floating-number');
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 1000);
}

function switchScreen(screenName) {
    Object.values(UI.screens).forEach(el => el.classList.add('hidden'));
    UI.screens[screenName].classList.remove('hidden');

    if (screenName === 'shop') {
        updateShopButtons();
    }
}

/**
 * Rendering
 */
function render() {
    renderScore();
    renderHp();

    UI.displays.stage.textContent = state.stage;
    UI.displays.monster.src = monsters[state.currentMonsterIndex];

    // Shop
    UI.displays.damageVal.textContent = state.damage;
    UI.displays.multiplierVal.textContent = state.multiplier;
    UI.displays.autoStatus.textContent = state.autoDamage ? "Вкл" : "Выкл";
    UI.displays.costDamage.textContent = state.costs.damage;
    UI.displays.costDouble.textContent = state.costs.double;
    if (!state.autoDamage) UI.displays.costAuto.textContent = state.costs.auto;

    updateShopButtons();
}

function renderScore() {
    UI.displays.score.textContent = Math.floor(state.score);
    UI.displays.shopScore.textContent = Math.floor(state.score);
}

function renderHp() {
    const pct = Math.max(0, (state.monsterHp / state.maxHp) * 100);
    UI.displays.hpBar.style.width = `${pct}%`;
    UI.displays.hpText.textContent = `${Math.ceil(state.monsterHp)} / ${state.maxHp}`;
}

function updateShopButtons() {
    UI.buttons.upgradeDamage.disabled = state.score < state.costs.damage;
    UI.buttons.doubleDamage.disabled = state.score < state.costs.double;
    UI.buttons.autoDamage.disabled = state.autoDamage || state.score < state.costs.auto;
}

/**
 * Persistence
 */
function saveGame() {
    localStorage.setItem('clickerGameSave', JSON.stringify(state));
}

function loadGame() {
    const saved = localStorage.getItem('clickerGameSave');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
        } catch (e) {
            console.error("Corrupt save file", e);
        }
    }
}

function resetGame() {
    localStorage.removeItem('clickerGameSave');
    location.reload();
}
