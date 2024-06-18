document.addEventListener('DOMContentLoaded', () => {
    const availablePointsDisplay = document.getElementById('availablePoints');
    const upgradeDamageButton = document.getElementById('upgradeDamageButton');
    const doubleDamageButton = document.getElementById('doubleDamageButton');
    const reduceMonsterHpButton = document.getElementById('reduceMonsterHpButton');
    const resetUpgradeButton = document.getElementById('resetUpgradeButton');
    const multiplierDisplay = document.getElementById('multiplier');
    const damageDisplay = document.getElementById('damage');
    const autoReduceStatusDisplay = document.getElementById('autoReduceStatus');

    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';

    function updateDisplay() {
        availablePointsDisplay.textContent = score.toString();
        multiplierDisplay.textContent = damageMultiplier.toString();
        damageDisplay.textContent = (damageMultiplier * 2).toString();
        autoReduceStatusDisplay.textContent = autoReduceEnabled ? 'включен' : 'выключен';
    }

    function updateButtons() {
        upgradeDamageButton.disabled = score < 10;
        doubleDamageButton.disabled = score < 50;
        reduceMonsterHpButton.disabled = score < 100 || autoReduceEnabled;
    }

    updateDisplay();
    updateButtons();

    upgradeDamageButton.addEventListener('click', () => {
        if (score >= 10) {
            score -= 10;
            damageMultiplier += 1;
            setLocalStorageItem('score', score);
            setLocalStorageItem('damageMultiplier', damageMultiplier);
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    doubleDamageButton.addEventListener('click', () => {
        if (score >= 50) {
            score -= 50;
            damageMultiplier *= 2;
            setLocalStorageItem('score', score);
            setLocalStorageItem('damageMultiplier', damageMultiplier);
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    reduceMonsterHpButton.addEventListener('click', () => {
        if (score >= 100) {
            score -= 100;
            autoReduceEnabled = true;
            setLocalStorageItem('score', score);
            setLocalStorageItem('autoReduce', 'true');
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    resetUpgradeButton.addEventListener('click', () => {
        clearGameData();
        score = 0;
        damageMultiplier = 1;
        autoReduceEnabled = false;
        updateDisplay();
        updateButtons();
        playGoldSound();
        console.log('Очки и улучшения сброшены');
    });

    function getLocalStorageItem(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function clearGameData() {
        localStorage.clear();
        console.log('Данные улучшений очищены');
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'score' || event.key === 'damageMultiplier' || event.key === 'autoReduce') {
            score = getLocalStorageItem('score', 0);
            damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
            autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
            updateDisplay();
            updateButtons();
        }
    });

    if (autoReduceEnabled) {
        setInterval(() => {
            let currentMonsterHp = getLocalStorageItem('monsterHp', 100);
            if (currentMonsterHp > 0) {
                currentMonsterHp = Math.max(currentMonsterHp - 2 * damageMultiplier, 0);
                setLocalStorageItem('monsterHp', currentMonsterHp);
                console.log(`Монстр HP: ${currentMonsterHp}`);
            } else {
                currentMonsterHp = getLocalStorageItem('baseMonsterHp', 100);
                setLocalStorageItem('monsterHp', currentMonsterHp);
                console.log('Монстр восстановил HP');
            }
        }, 1000);
    }
});
