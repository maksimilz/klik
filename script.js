document.addEventListener('DOMContentLoaded', () => {
    const clickerButton = document.getElementById('clickerButton');
    const resetButton = document.getElementById('resetButton');
    const scoreDisplay = document.getElementById('score');
    const monster = document.getElementById('monster');
    const monsterHpDisplay = document.getElementById('monsterHp');
    const monsters = ['img/monster1.png', 'img/monster2.png', 'img/monster3.png'];
    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
    let monsterHp = getLocalStorageItem('monsterHp', 100);
    let currentMonsterIndex = getLocalStorageItem('currentMonsterIndex', 0);
    let baseMonsterHp = getLocalStorageItem('baseMonsterHp', 100);
    let autoCollectInterval;

    scoreDisplay.textContent = score;
    monsterHpDisplay.textContent = monsterHp;
    monster.src = monsters[currentMonsterIndex];

    clickerButton.addEventListener('click', () => {
        score += damageMultiplier;
        updateScoreDisplay(score);
        setLocalStorageItem('score', score);

        if (monsterHp > 0) {
            monsterHp = Math.max(monsterHp - 2 * damageMultiplier, 0); // Не допускаем отрицательных значений HP
            updateMonsterHpDisplay(monsterHp);
            setLocalStorageItem('monsterHp', monsterHp);
        }
        if (monsterHp <= 0) {
            clickerButton.disabled = true; // Отключаем кнопку, чтобы избежать множественных кликов
            monster.classList.add('monster-death');
            setTimeout(() => {
                currentMonsterIndex = (currentMonsterIndex + 1) % monsters.length;
                baseMonsterHp *= 2; // Сильно увеличиваем базовое HP монстра
                monsterHp = baseMonsterHp;
                setLocalStorageItem('monsterHp', monsterHp);
                setLocalStorageItem('baseMonsterHp', baseMonsterHp);
                setLocalStorageItem('currentMonsterIndex', currentMonsterIndex);
                updateMonsterImage(monsters[currentMonsterIndex]);
                updateMonsterHpDisplay(monsterHp); // Обновляем HP после смены монстра
                monster.classList.remove('monster-death');
                clickerButton.disabled = false; // Включаем кнопку после обновления
            }, 1000); // Время анимации распада
        }
    });

    resetButton.addEventListener('click', () => {
        clearGameData();
        score = 0;
        baseMonsterHp = 100;
        monsterHp = baseMonsterHp;
        updateScoreDisplay(score);
        updateMonsterHpDisplay(monsterHp);
        clearInterval(autoCollectInterval);
        autoReduceEnabled = false;
        console.log('Очки и HP монстра сброшены');
    });

    if (autoReduceEnabled) {
        autoCollectInterval = setInterval(() => {
            score += damageMultiplier;
            updateScoreDisplay(score);
            setLocalStorageItem('score', score);
            console.log('Автоматическое начисление очков');
            autoReduceMonsterHp();
        }, 1000);
    }

    function getLocalStorageItem(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function updateScoreDisplay(score) {
        scoreDisplay.textContent = score;
    }

    function updateMonsterHpDisplay(hp) {
        monsterHpDisplay.textContent = hp;
    }

    function updateMonsterImage(src) {
        monster.src = src;
    }

    function autoReduceMonsterHp() {
        if (monsterHp > 0) {
            monsterHp = Math.max(monsterHp - 2 * damageMultiplier, 0); // Не допускаем отрицательных значений HP
            updateMonsterHpDisplay(monsterHp);
            setLocalStorageItem('monsterHp', monsterHp);
        }
        if (monsterHp <= 0) {
            clickerButton.disabled = true; // Отключаем кнопку, чтобы избежать множественных кликов
            monster.classList.add('monster-death');
            setTimeout(() => {
                currentMonsterIndex = (currentMonsterIndex + 1) % monsters.length;
                baseMonsterHp *= 2; // Сильно увеличиваем базовое HP монстра
                monsterHp = baseMonsterHp;
                setLocalStorageItem('monsterHp', monsterHp);
                setLocalStorageItem('baseMonsterHp', baseMonsterHp);
                setLocalStorageItem('currentMonsterIndex', currentMonsterIndex);
                updateMonsterImage(monsters[currentMonsterIndex]);
                updateMonsterHpDisplay(monsterHp); // Обновляем HP после смены монстра
                monster.classList.remove('monster-death');
                clickerButton.disabled = false; // Включаем кнопку после обновления
            }, 1000); // Время анимации распада
        }
    }

    function clearGameData() {
        localStorage.removeItem('score');
        localStorage.removeItem('damageMultiplier');
        localStorage.removeItem('autoReduce');
        localStorage.removeItem('monsterHp');
        localStorage.removeItem('baseMonsterHp');
        localStorage.removeItem('currentMonsterIndex');
        console.log('Данные игры очищены');
    }
});
