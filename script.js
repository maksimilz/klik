document.addEventListener('DOMContentLoaded', () => {
    const monster = document.getElementById('monster');
    const resetButton = document.getElementById('resetButton');
    const scoreDisplay = document.getElementById('score');
    const monsterHpDisplay = document.getElementById('monsterHp');
    const monsters = ['img/monster1.png', 'img/monster2.png', 'img/monster3.png','img/monster4.png','img/monster5.png','img/monster6.png','img/monster7.png','img/monster8.png'];
    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
    let monsterHp = getLocalStorageItem('monsterHp', 100);
    let baseMonsterHp = getLocalStorageItem('baseMonsterHp', 100);
    let currentMonsterIndex = getLocalStorageItem('currentMonsterIndex', 0);
    let autoCollectInterval;

    scoreDisplay.textContent = score;
    monsterHpDisplay.textContent = monsterHp;
    monster.src = monsters[currentMonsterIndex];

    monster.addEventListener('click', () => {
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
            monster.classList.add('monster-death');
            playDestroySound();
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
            }, 500); // 0.5 seconds for the destruction animation
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
        playGoldSound();
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

    function autoReduceMonsterHp() {
        if (monsterHp > 0) {
            monsterHp = Math.max(monsterHp - 2 * damageMultiplier, 0);
            updateMonsterHpDisplay(monsterHp);
            setLocalStorageItem('monsterHp', monsterHp);
        }
        if (monsterHp <= 0) {
            monster.classList.add('monster-death');
            playDestroySound();
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
            }, 500); // 0.5 seconds for the destruction animation
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
