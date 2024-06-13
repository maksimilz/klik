document.addEventListener('DOMContentLoaded', () => {
    const availablePointsDisplay = document.getElementById('availablePoints');
    const upgradeDamageButton = document.getElementById('upgradeDamageButton');
    const reduceMonsterHpButton = document.getElementById('reduceMonsterHpButton');
    const resetUpgradeButton = document.getElementById('resetUpgradeButton');
    const multiplierDisplay = document.getElementById('multiplier');
    const damageDisplay = document.getElementById('damage');
    const autoReduceStatusDisplay = document.getElementById('autoReduceStatus');

    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';

    function updateDisplay() {
        availablePointsDisplay.textContent = score;
        multiplierDisplay.textContent = damageMultiplier;
        damageDisplay.textContent = damageMultiplier * 2;
        autoReduceStatusDisplay.textContent = autoReduceEnabled ? 'включен' : 'выключен';
    }

    function updateButtons() {
        upgradeDamageButton.disabled = score < 10;
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
        localStorage.removeItem('score');
        localStorage.removeItem('damageMultiplier');
        localStorage.removeItem('autoReduce');
        localStorage.removeItem('monsterHp');
        localStorage.removeItem('baseMonsterHp');
        localStorage.removeItem('currentMonsterIndex');
        console.log('Данные улучшений очищены');
    }

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
