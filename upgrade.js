document.addEventListener('DOMContentLoaded', () => {
    const availablePointsDisplay = document.getElementById('availablePoints');
    const upgradeDamageButton = document.getElementById('upgradeDamageButton');
    const doubleDamageButton = document.getElementById('doubleDamageButton');
    const reduceMonsterHpButton = document.getElementById('reduceMonsterHpButton');
    const resetUpgradeButton = document.getElementById('resetUpgradeButton');
    const multiplierDisplay = document.getElementById('multiplier');
    const damageDisplay = document.getElementById('damage');
    const autoReduceStatusDisplay = document.getElementById('autoReduceStatus');
    const upgradeDamageCostDisplay = document.getElementById('upgradeDamageCost');
    const doubleDamageCostDisplay = document.getElementById('doubleDamageCost');
    const reduceMonsterHpCostDisplay = document.getElementById('reduceMonsterHpCost');
    const progressBar = document.getElementById('progress');
    const modal = document.getElementById('resetModal');
    const confirmResetButton = document.getElementById('confirmResetButton');
    const cancelResetButton = document.getElementById('cancelResetButton');
    const closeButton = document.querySelector('.close-button');

    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
    let upgradeDamageCost = getLocalStorageItem('upgradeDamageCost', 10);
    let doubleDamageCost = getLocalStorageItem('doubleDamageCost', 50);
    let reduceMonsterHpCost = getLocalStorageItem('reduceMonsterHpCost', 100);

    function updateDisplay() {
        availablePointsDisplay.textContent = score.toString();
        multiplierDisplay.textContent = damageMultiplier.toString();
        damageDisplay.textContent = (damageMultiplier * 2).toString();
        autoReduceStatusDisplay.textContent = autoReduceEnabled ? 'включен' : 'выключен';
        upgradeDamageCostDisplay.textContent = upgradeDamageCost.toString();
        doubleDamageCostDisplay.textContent = doubleDamageCost.toString();
        reduceMonsterHpCostDisplay.textContent = reduceMonsterHpCost.toString();
        updateProgress(score);
    }

    function updateButtons() {
        upgradeDamageButton.disabled = score < upgradeDamageCost;
        doubleDamageButton.disabled = score < doubleDamageCost;
        reduceMonsterHpButton.disabled = score < reduceMonsterHpCost || autoReduceEnabled;
    }

    function updateProgress(progress) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    function handleUpgrade(button, cost, callback) {
        if (score >= cost) {
            score -= cost;
            callback();
            updateLocalStorage();
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    }

    upgradeDamageButton.addEventListener('click', () => {
        handleUpgrade(upgradeDamageButton, upgradeDamageCost, () => {
            damageMultiplier += 1;
            upgradeDamageCost += 10;
        });
    });

    doubleDamageButton.addEventListener('click', () => {
        handleUpgrade(doubleDamageButton, doubleDamageCost, () => {
            damageMultiplier *= 2;
            doubleDamageCost += 50;
        });
    });

    reduceMonsterHpButton.addEventListener('click', () => {
        handleUpgrade(reduceMonsterHpButton, reduceMonsterHpCost, () => {
            autoReduceEnabled = true;
            reduceMonsterHpCost += 100;
        });
    });

    resetUpgradeButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    confirmResetButton.addEventListener('click', () => {
        clearGameData();
        resetUpgrades();
        updateLocalStorage();
        updateDisplay();
        updateButtons();
        playGoldSound();
        modal.style.display = 'none';
        console.log('Очки и улучшения сброшены');
    });

    cancelResetButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function resetUpgrades() {
        score = 0;
        damageMultiplier = 1;
        autoReduceEnabled = false;
        upgradeDamageCost = 10;
        doubleDamageCost = 50;
        reduceMonsterHpCost = 100;
    }

    function getLocalStorageItem(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function updateLocalStorage() {
        setLocalStorageItem('score', score);
        setLocalStorageItem('damageMultiplier', damageMultiplier);
        setLocalStorageItem('autoReduce', autoReduceEnabled.toString());
        setLocalStorageItem('upgradeDamageCost', upgradeDamageCost);
        setLocalStorageItem('doubleDamageCost', doubleDamageCost);
        setLocalStorageItem('reduceMonsterHpCost', reduceMonsterHpCost);
    }

    function clearGameData() {
        localStorage.removeItem('score');
        localStorage.removeItem('damageMultiplier');
        localStorage.removeItem('autoReduce');
        localStorage.removeItem('upgradeDamageCost');
        localStorage.removeItem('doubleDamageCost');
        localStorage.removeItem('reduceMonsterHpCost');
        console.log('Данные улучшений очищены');
    }

    window.addEventListener('storage', (event) => {
        if (['score', 'damageMultiplier', 'autoReduce', 'upgradeDamageCost', 'doubleDamageCost', 'reduceMonsterHpCost'].includes(event.key)) {
            score = getLocalStorageItem('score', 0);
            damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
            autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
            upgradeDamageCost = getLocalStorageItem('upgradeDamageCost', 10);
            doubleDamageCost = getLocalStorageItem('doubleDamageCost', 50);
            reduceMonsterHpCost = getLocalStorageItem('reduceMonsterHpCost', 100);
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

    updateDisplay();
    updateButtons();
});
