const clickSound = new Audio('sound/the_sound_of_clickin.mp3');
const destroySound = new Audio('sound/Destroying_the_monst.mp3');
const goldSound = new Audio('sound/The_sound_of_gold_co.mp3');
const upgradeSound = new Audio('sound/unlocking_Upgrades.mp3');


clickSound.volume = 0.1;
destroySound.volume = 0.3;
goldSound.volume = 0.2;
upgradeSound.volume = 0.5;

function playClickSound() {
    clickSound.play().then(() => {
        console.log('Click sound played successfully.');
    }).catch(error => {
        console.error('Error playing click sound:', error);
    });
}

function playDestroySound() {
    destroySound.play().then(() => {
        console.log('Destroy sound played successfully.');
    }).catch(error => {
        console.error('Error playing destroy sound:', error);
    });
}

function playGoldSound() {
    goldSound.play().then(() => {
        console.log('Gold sound played successfully.');
    }).catch(error => {
        console.error('Error playing gold sound:', error);
    });
}

function playUpgradeSound() {
    upgradeSound.play().then(() => {
        console.log('Upgrade sound played successfully.');
    }).catch(error => {
        console.error('Error playing upgrade sound:', error);
    });
}
