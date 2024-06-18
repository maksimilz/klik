document.addEventListener('DOMContentLoaded', () => {
    const clickerButton = document.getElementById('clickerButton');
    const resetButton = document.getElementById('resetButton');
    const scoreDisplay = document.getElementById('score');
    const monster = document.getElementById('monster');
    const monsterHpDisplay = document.getElementById('monsterHp');
    const monsters = ['img/monster1.png', 'img/monster2.png', 'img/monster3.png', 'img/monster4.png', 'img/monster5.png', 'img/monster6.png', 'img/monster7.png', 'img/monster8.png'];
    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
    let monsterHp = getLocalStorageItem('monsterHp', 100);
    let baseMonsterHp = getLocalStorageItem('baseMonsterHp', 100);
    let currentMonsterIndex = getLocalStorageItem('currentMonsterIndex', 0);
    let autoCollectInterval;

    function initGame() {
        score = getLocalStorageItem('score', 0);
        damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
        autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
        monsterHp = getLocalStorageItem('monsterHp', 100);
        baseMonsterHp = getLocalStorageItem('baseMonsterHp', 100);
        currentMonsterIndex = getLocalStorageItem('currentMonsterIndex', 0);

        scoreDisplay.textContent = score;
        monsterHpDisplay.textContent = monsterHp;
        monster.src = monsters[currentMonsterIndex];

        if (autoReduceEnabled) {
            autoCollectInterval = setInterval(() => {
                score += damageMultiplier;
                updateScoreDisplay(score);
                setLocalStorageItem('score', score);
                console.log('Автоматическое начисление очков');
                autoReduceMonsterHp();
            }, 1000);
        }
    }

    initGame();

    clickerButton.addEventListener('click', () => {
        score += damageMultiplier;
        updateScoreDisplay(score);
        setLocalStorageItem('score', score);

        if (monsterHp > 0) {
            monsterHp = Math.max(monsterHp - 2 * damageMultiplier, 0);
            updateMonsterHpDisplay(monsterHp);
            setLocalStorageItem('monsterHp', monsterHp);
            playClickSound();
        }
        if (monsterHp <= 0) {
            clickerButton.disabled = true; // Disable the clicker button
            playDestroySound();
            monster.classList.add('monster-death');
            setTimeout(() => {
                currentMonsterIndex = (currentMonsterIndex + 1) % monsters.length;
                monster.src = monsters[currentMonsterIndex];
                baseMonsterHp = Math.round(baseMonsterHp * 1.5);
                monsterHp = baseMonsterHp;
                updateMonsterHpDisplay(monsterHp);
                setLocalStorageItem('monsterHp', monsterHp);
                setLocalStorageItem('baseMonsterHp', baseMonsterHp);
                setLocalStorageItem('currentMonsterIndex', currentMonsterIndex);
                monster.classList.remove('monster-death');
                clickerButton.disabled = false; // Enable the clicker button after animation
            }, 500); // 0.5 seconds for the destruction animation
        }
    });

    resetButton.addEventListener('click', () => {
        clearGameData();
        score = 0;
        baseMonsterHp = 100;
        monsterHp = baseMonsterHp;
        damageMultiplier = 1;
        updateScoreDisplay(score);
        updateMonsterHpDisplay(monsterHp);
        setLocalStorageItem('score', score);
        setLocalStorageItem('damageMultiplier', damageMultiplier);
        setLocalStorageItem('autoReduce', 'false');
        setLocalStorageItem('monsterHp', monsterHp);
        setLocalStorageItem('baseMonsterHp', baseMonsterHp);
        setLocalStorageItem('currentMonsterIndex', 0);
        autoReduceEnabled = false;
        clearInterval(autoCollectInterval);
        playGoldSound();
        console.log('Очки и HP монстра сброшены');
    });

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

    function autoReduceMonsterHp() {
        if (monsterHp > 0) {
            monsterHp = Math.max(monsterHp - 2 * damageMultiplier, 0);
            updateMonsterHpDisplay(monsterHp);
            setLocalStorageItem('monsterHp', monsterHp);
        }
        if (monsterHp <= 0) {
            clickerButton.disabled = true; // Disable the clicker button
            playDestroySound();
            monster.classList.add('monster-death');
            setTimeout(() => {
                currentMonsterIndex = (currentMonsterIndex + 1) % monsters.length;
                monster.src = monsters[currentMonsterIndex];
                baseMonsterHp = Math.round(baseMonsterHp * 1.5);
                monsterHp = baseMonsterHp;
                updateMonsterHpDisplay(monsterHp);
                setLocalStorageItem('monsterHp', monsterHp);
                setLocalStorageItem('baseMonsterHp', baseMonsterHp);
                setLocalStorageItem('currentMonsterIndex', currentMonsterIndex);
                monster.classList.remove('monster-death');
                clickerButton.disabled = false; // Enable the clicker button after animation
            }, 500); // 0.5 seconds for the destruction animation
        }
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'score' || event.key === 'monsterHp' || event.key === 'damageMultiplier' || event.key === 'autoReduce') {
            initGame();
        }
    });

    function clearGameData() {
        localStorage.clear();
        console.log('Данные игры очищены');
    }
});
