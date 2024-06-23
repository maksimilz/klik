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
        progressBar.style.width = Math.min(progress, 100) + '%'; // Ограничение ширины до 100%
    }

    updateDisplay();
    updateButtons();

    upgradeDamageButton.addEventListener('click', () => {
        if (score >= upgradeDamageCost) {
            score -= upgradeDamageCost;
            damageMultiplier += 1;
            upgradeDamageCost += 10; // Увеличение стоимости
            setLocalStorageItem('score', score);
            setLocalStorageItem('damageMultiplier', damageMultiplier);
            setLocalStorageItem('upgradeDamageCost', upgradeDamageCost);
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    doubleDamageButton.addEventListener('click', () => {
        if (score >= doubleDamageCost) {
            score -= doubleDamageCost;
            damageMultiplier *= 2;
            doubleDamageCost += 50; // Увеличение стоимости
            setLocalStorageItem('score', score);
            setLocalStorageItem('damageMultiplier', damageMultiplier);
            setLocalStorageItem('doubleDamageCost', doubleDamageCost);
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    reduceMonsterHpButton.addEventListener('click', () => {
        if (score >= reduceMonsterHpCost) {
            score -= reduceMonsterHpCost;
            autoReduceEnabled = true;
            reduceMonsterHpCost += 100; // Увеличение стоимости
            setLocalStorageItem('score', score);
            setLocalStorageItem('autoReduce', 'true');
            setLocalStorageItem('reduceMonsterHpCost', reduceMonsterHpCost);
            updateDisplay();
            updateButtons();
            playUpgradeSound();
        }
    });

    resetUpgradeButton.addEventListener('click', () => {
        const modal = document.getElementById('resetModal');
        modal.style.display = 'block';
    });

    const confirmResetButton = document.getElementById('confirmResetButton');
    const cancelResetButton = document.getElementById('cancelResetButton');
    const closeButton = document.querySelector('.close-button');

    confirmResetButton.addEventListener('click', () => {
        clearGameData();
        score = 0;
        damageMultiplier = 1;
        autoReduceEnabled = false;
        upgradeDamageCost = 10;
        doubleDamageCost = 50;
        reduceMonsterHpCost = 100;
        updateDisplay();
        updateButtons();
        playGoldSound();
        const modal = document.getElementById('resetModal');
        modal.style.display = 'none';
        console.log('Очки и улучшения сброшены');
    });

    cancelResetButton.addEventListener('click', () => {
        const modal = document.getElementById('resetModal');
        modal.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        const modal = document.getElementById('resetModal');
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('resetModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
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
        if (event.key === 'score' || event.key === 'damageMultiplier' || event.key === 'autoReduce' || event.key === 'upgradeDamageCost' || event.key === 'doubleDamageCost' || event.key === 'reduceMonsterHpCost') {
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
});
