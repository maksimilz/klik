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

    let autoReduceInterval;

    function updateDisplay() {
        availablePointsDisplay.textContent = score;
        multiplierDisplay.textContent = damageMultiplier;
        damageDisplay.textContent = damageMultiplier * 2;
        autoReduceStatusDisplay.textContent = autoReduceEnabled ? 'включен' : 'выключен';
    }

    updateDisplay();

    function updateButtons() {
        upgradeDamageButton.disabled = score < 10;
        reduceMonsterHpButton.disabled = score < 100 || autoReduceEnabled;
    }

    updateButtons();

    upgradeDamageButton.addEventListener('click', () => {
        if (score >= 10) {
            score -= 10;
            damageMultiplier += 1;
            setLocalStorageItem('score', score);
            setLocalStorageItem('damageMultiplier', damageMultiplier);
            updateDisplay();
            updateButtons();
        }
    });

    reduceMonsterHpButton.addEventListener('click', () => {
        if (score >= 100) {
            score -= 100;
            autoReduceEnabled = true;
            setLocalStorageItem('score', score);
            setLocalStorageItem('autoReduce', 'true');
            updateDisplay();
            autoReduceMonsterHp();
            updateButtons();
        }
    });

    resetUpgradeButton.addEventListener('click', () => {
        clearGameData();
        score = 0;
        damageMultiplier = 1;
        autoReduceEnabled = false;
        updateDisplay();
        updateButtons();
        console.log('Очки и улучшения сброшены');
    });

    function autoReduceMonsterHp() {
        if (autoReduceInterval) clearInterval(autoReduceInterval);
        autoReduceInterval = setInterval(() => {
            let currentMonsterHp = getLocalStorageItem('monsterHp', 100);
            if (currentMonsterHp > 0) {
                currentMonsterHp -= 2 * damageMultiplier;
                setLocalStorageItem('monsterHp', currentMonsterHp);
                console.log(`Монстр HP: ${currentMonsterHp}`);
            } else {
                let currentcurrentMonsterHp = 100;
                setLocalStorageItem('monsterHp', currentMonsterHp);
                console.log(`Монстр восстановил HP`);
            }
            updateMonsterHpDisplay(currentMonsterHp);
        }, 1000);
    }

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
        localStorage.removeItem('currentMonsterIndex');
        console.log('Данные улучшений очищены');
    }

    if (autoReduceEnabled) {
        autoReduceMonsterHp();
    }
});
