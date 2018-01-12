// Calculator:

const beansInput = document.querySelector("#beans");
const ratioInput = document.querySelector("#ratio");
const waterInput = document.querySelector("#water");
const coffeeInput = document.querySelector("#coffee");

const calculateBeans = (water, ratio) => ratio === 0 ? 0 : water / ratio;
const calculateRatio = (water, beans) => beans === 0 ? 0 : water / beans;
const calculateWater = (beans, ratio) => beans * ratio;
const calculateWaterFromCoffee = (coffee) => coffee / 0.9;
const calculateCoffee = (water) => water * 0.9;

let lastChanges = [ratioInput, beansInput];

let beans = 8;
let ratio = 16;
let water = calculateWater(beans, ratio);
let coffee = calculateCoffee(water);

const onInputChange = ({target}) => {
    if (lastChanges[0] !== target) {
        lastChanges = [target, lastChanges[0]];
    }

    if (lastChanges.every(input => input.validity.valid)) {

        if (!lastChanges.includes(beansInput)) {
            water = waterInput.valueAsNumber;
            ratio = ratioInput.valueAsNumber;
            beans = calculateBeans(water, ratio);
        } else if (!lastChanges.includes(ratioInput)) {
            water = waterInput.valueAsNumber;
            beans = beansInput.valueAsNumber;
            ratio = calculateRatio(water, beans);
        } else {
            beans = beansInput.valueAsNumber;
            ratio = ratioInput.valueAsNumber;
            water = calculateWater(beans, ratio);
        }

        coffee = calculateCoffee(water);

        writeInputValues();
    }
};

const onCoffeeInputChange = () => {
    if (lastChanges[0] !== waterInput) {
        lastChanges = [waterInput, lastChanges[0]];
    }

    if (coffeeInput.validity.valid) {
        coffee = coffeeInput.valueAsNumber;
        water = calculateWaterFromCoffee(coffee);
    }

    if (lastChanges.every(input => input.validity.valid)) {

        if (!lastChanges.includes(beansInput)) {
            ratio = ratioInput.valueAsNumber;
            beans = calculateBeans(water, ratio);
        } else {
            beans = beansInput.valueAsNumber;
            ratio = calculateRatio(water, beans);
        }

        writeInputValues();
    }
};

const formatNumber = nr => Math.round(nr % 1 * 10) % 10 === 0 ? nr.toFixed(0) : Math.round(nr * 10 % 1 * 10) % 10 === 0 ? nr.toFixed(1) : nr.toFixed(2);

const writeInputValues = () => {
    beansInput.value = formatNumber(beans);
    ratioInput.value = formatNumber(ratio);
    waterInput.value = formatNumber(water);
    coffeeInput.value = formatNumber(coffee);
};

beansInput.addEventListener("input", onInputChange);
ratioInput.addEventListener("input", onInputChange);
waterInput.addEventListener("input", onInputChange);
coffeeInput.addEventListener("input", onCoffeeInputChange);

writeInputValues();

// Timer:

const timerInput = document.querySelector("#timer");
const countdownInput = document.querySelector("#countdown");

const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const resetButton = document.querySelector("#reset");

const progressElement = document.querySelector("#progress");

let timer, countdown, runningInterval;

const decrementCountdownValue = () => {
    countdown--;
    writeCountdownValue();
    if (countdown === 0) stopTimer();
};
const writeCountdownValue = () => {
    countdownInput.value = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}`;

    let percentage = (1 - countdown / timer) * 100;
    progressElement.style.width = `${percentage}%`;
    progressElement.setAttribute("aria-valuenow", percentage);
};

const startTimer = () => {
    if (countdown > 0) runningInterval = setInterval(decrementCountdownValue, 1000);
};
const stopTimer = () => {
    clearInterval(runningInterval);
};
const resetTimer = () => {
    countdown = timer;
    writeCountdownValue();
};

const onTimerInputChange = () => {
    if (timerInput.validity.valid) {
        timer = Math.round(timerInput.valueAsNumber * 60);
        stopTimer();
        resetTimer();
    }
};
const onStartClick = () => {
    stopTimer();
    startTimer();
};
const onStopClick = () => {
    stopTimer();
};
const onResetClick = () => {
    stopTimer();
    resetTimer();
};

timerInput.addEventListener("input", onTimerInputChange);
startButton.addEventListener("click", onStartClick);
stopButton.addEventListener("click", onStopClick);
resetButton.addEventListener("click", onResetClick);

onTimerInputChange();

// Daytime infobox

const beforeSunriseElement = document.querySelector("#before-sunrise");
const forenoonElement = document.querySelector("#forenoon");
const middayElement = document.querySelector("#midday");
const eveningElement = document.querySelector("#evening");
const afterSunsetElement = document.querySelector("#after-sunset");

new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
    .then(({coords: {latitude, longitude}}) => fetch(`https://api.sunrise-sunset.org/json?formatted=0&lat=${latitude}&lng=${longitude}&date=${new Date().toDateString()}`))
    .then(res => res.json())
    .then(({status, results}) => {
        if (status !== "OK") throw status;
        return results;
    })
    .then(({civil_twilight_begin, civil_twilight_end}) => {
        let now = new Date();
        let dawn = new Date(civil_twilight_begin);
        let dusk = new Date(civil_twilight_end);

        let elementToBeShown;
        if (now < dawn) elementToBeShown = beforeSunriseElement; // before sunrise
        else if (now.getHours() < 10) elementToBeShown = forenoonElement; // forenoon (after sunrise)
        else if (now > dusk) elementToBeShown = afterSunsetElement; // after sunset
        else if (now.getHours() >= 16) elementToBeShown = eveningElement; // evening (before sunset)
        else elementToBeShown = middayElement; // midday, afternoon

        elementToBeShown.removeAttribute("hidden");
    })
    .catch(error => console.log("Daytime infobox fetch failed", error));
