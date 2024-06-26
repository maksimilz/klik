document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.upgrade-link');
    const monster = document.getElementById('monster');
    const scoreDisplay = document.getElementById('score');
    const monsterHpDisplay = document.getElementById('monsterHp');
    const hpBar = document.getElementById('hpBar');
    const resetButton = document.getElementById('resetButton');
    const resetModal = document.getElementById('resetModal');
    const confirmResetButton = document.getElementById('confirmResetButton');
    const cancelResetButton = document.getElementById('cancelResetButton');
    const closeButton = document.querySelector('.close-button');

    const monsters = [
        'img/monster1.png', 'img/monster2.png', 'img/monster3.png',
        'img/monster4.png', 'img/monster5.png', 'img/monster6.png',
        'img/monster7.png', 'img/monster8.png'
    ];

    let score = getLocalStorageItem('score', 0);
    let damageMultiplier = getLocalStorageItem('damageMultiplier', 1);
    let autoReduceEnabled = getLocalStorageItem('autoReduce', 'false') === 'true';
    let monsterHp = getLocalStorageItem('monsterHp', 200); // Увеличено начальное значение HP монстра
    let baseMonsterHp = getLocalStorageItem('baseMonsterHp', 200); // Увеличено начальное значение базового HP
    let currentMonsterIndex = getLocalStorageItem('currentMonsterIndex', 0);
    let autoCollectInterval;

    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('data-href');
    });

    resetButton.addEventListener('click', () => {
        resetModal.style.display = 'block';
    });

    confirmResetButton.addEventListener('click', () => {
        clearGameData();
        resetModal.style.display = 'none';
    });

    cancelResetButton.addEventListener('click', () => {
        resetModal.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        resetModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == resetModal) {
            resetModal.style.display = 'none';
        }
    });

    updateUI();

    monster.addEventListener('click', onMonsterClick);

    if (autoReduceEnabled) {
        autoCollectInterval = setInterval(autoCollect, 1000);
    }

    window.addEventListener('load', () => {
        console.log('Все ресурсы загружены');
    });

    function updateUI() {
        scoreDisplay.textContent = score;
        monsterHpDisplay.textContent = monsterHp;
        hpBar.style.width = `${(monsterHp / baseMonsterHp) * 100}%`;
        monster.src = monsters[currentMonsterIndex];
    }

    function onMonsterClick() {
        score += damageMultiplier;
        updateScore();
        updateMonsterHp(-2 * damageMultiplier);
        playClickSound();

        if (monsterHp <= 0) {
            onMonsterDeath();
        }
    }

    function onMonsterDeath() {
        monster.classList.add('monster-death');
        playDestroySound();
        setTimeout(respawnMonster, 500);
    }

    function respawnMonster() {
        currentMonsterIndex = (currentMonsterIndex + 1) % monsters.length;
        monster.src = monsters[currentMonsterIndex];
        baseMonsterHp = Math.round(baseMonsterHp * 2); // Увеличен коэффициент прироста HP монстра
        monsterHp = baseMonsterHp;
        updateMonsterHp(0);
        monster.classList.remove('monster-death');
    }

    function updateScore() {
        scoreDisplay.textContent = score;
        setLocalStorageItem('score', score);
    }

    function updateMonsterHp(damage) {
        monsterHp = Math.max(monsterHp + damage, 0);
        monsterHpDisplay.textContent = monsterHp;
        hpBar.style.width = `${(monsterHp / baseMonsterHp) * 100}%`;
        setLocalStorageItem('monsterHp', monsterHp);
    }

    function autoCollect() {
        score += damageMultiplier;
        updateScore();
        console.log('Автоматическое начисление очков');
        updateMonsterHp(-2 * damageMultiplier);

        if (monsterHp <= 0) {
            onMonsterDeath();
        }
    }

    function getLocalStorageItem(key, defaultValue) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function clearGameData() {
        ['score', 'damageMultiplier', 'autoReduce', 'monsterHp', 'baseMonsterHp', 'currentMonsterIndex'].forEach((key) => {
            localStorage.removeItem(key);
        });
        score = 0; // Сброс очков
        damageMultiplier = 1; // Сброс множителя урона
        autoReduceEnabled = false; // Сброс автоматического уменьшения HP монстра
        baseMonsterHp = 200; // Установка базового HP монстра
        monsterHp = baseMonsterHp; // Установка текущего HP монстра
        currentMonsterIndex = 0; // Сброс индекса текущего монстра
        updateUI();
        console.log('Данные игры очищены');
    }
});
