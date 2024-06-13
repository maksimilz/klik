const clickSound = new Audio('sound/the_sound_of_clickin.mp3');
const destroySound = new Audio('sound/Destroying_the_monst.mp3');
const goldSound = new Audio('sound/The_sound_of_gold_co.mp3');
const upgradeSound = new Audio('sound/unlocking_Upgrades.mp3');

function playClickSound() {
    clickSound.play();
}

function playDestroySound() {
    destroySound.play();
}

function playGoldSound() {
    goldSound.play();
}

function playUpgradeSound() {
    upgradeSound.play();
}
