// Calculator:

const beansInput = document.querySelector("#beans");
const ratioInput = document.querySelector("#ratio");
const waterInput = document.querySelector("#water");
const coffeeInput = document.querySelector("#coffee");

const beansSlider = document.querySelector("#beans-slider");
const ratioSlider = document.querySelector("#ratio-slider");
const waterSlider = document.querySelector("#water-slider");
const coffeeSlider = document.querySelector("#coffee-slider");

const calculateBeans = (water, ratio) => ratio === 0 ? 0 : water / ratio;
const calculateRatio = (water, beans) => beans === 0 ? 0 : water / beans;
const calculateWater = (beans, ratio) => beans * ratio;
const calculateWaterFromCoffee = (coffee) => coffee / 0.9;
const calculateCoffee = (water) => water * 0.9;

const isValid = input => input.valueAsNumber > 0;
const markAsValid = input => {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}
const markAsInvalid = input => {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
};
const markAsValidOrInvalid = input => isValid(input) ? markAsValid(input) : markAsInvalid(input);
const markAsComputed = input => {
    input.classList.remove("is-valid", "is-invalid");
};

let lastChanges = [ratioInput, beansInput];

let beans = 8;
let ratio = 16;
let water = calculateWater(beans, ratio);
let coffee = calculateCoffee(water);

const onInputChange = ({target}) => {
    markAsValidOrInvalid(target);

    if (lastChanges[0] !== target) {
        lastChanges = [target, lastChanges[0]];
    }

    if (lastChanges.every(isValid)) {

        if (!lastChanges.includes(beansInput)) {
            water = waterInput.valueAsNumber;
            ratio = ratioInput.valueAsNumber;

            beans = calculateBeans(water, ratio);
            markAsComputed(beansInput);
        } else if (!lastChanges.includes(ratioInput)) {
            water = waterInput.valueAsNumber;
            beans = beansInput.valueAsNumber;

            ratio = calculateRatio(water, beans);
            markAsComputed(ratioInput);
        } else {
            beans = beansInput.valueAsNumber;
            ratio = ratioInput.valueAsNumber;

            water = calculateWater(beans, ratio);
            markAsComputed(waterInput);
        }

        coffee = calculateCoffee(water);
        markAsComputed(coffeeInput);

        writeInputValues();
    }
};

const onCoffeeInputChange = () => {
    markAsValidOrInvalid(coffeeInput);

    if (lastChanges[0] !== waterInput) {
        lastChanges = [waterInput, lastChanges[0]];
    }

    if (isValid(coffeeInput)) {
        coffee = coffeeInput.valueAsNumber;

        water = calculateWaterFromCoffee(coffee);
        markAsComputed(waterInput);
    }

    if (lastChanges.every(isValid)) {

        if (!lastChanges.includes(beansInput)) {
            ratio = ratioInput.valueAsNumber;

            beans = calculateBeans(water, ratio);
            markAsComputed(beansInput);
        } else {
            beans = beansInput.valueAsNumber;

            ratio = calculateRatio(water, coffee);
            markAsComputed(ratioInput);
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

    beansSlider.value = beans;
    ratioSlider.value = ratio;
    waterSlider.value = water;
    coffeeSlider.value = coffee;
};

beansInput.addEventListener("input", onInputChange);
ratioInput.addEventListener("input", onInputChange);
waterInput.addEventListener("input", onInputChange);
coffeeInput.addEventListener("input", onCoffeeInputChange);

const onSliderChange = ({target}) => {
    if (target === beansSlider) {
        beansInput.value = beansSlider.valueAsNumber;
        onInputChange({target: beansInput});
    } else if (target === ratioSlider) {
        ratioInput.value = ratioSlider.valueAsNumber;
        onInputChange({target: ratioInput});
    } else if (target === waterSlider) {
        waterInput.value = waterSlider.valueAsNumber;
        onInputChange({target: waterInput});
    } else if (target === coffeeSlider) {
        coffeeInput.value = coffeeSlider.valueAsNumber;
        onCoffeeInputChange();
    }
};

beansSlider.addEventListener("input", onSliderChange);
ratioSlider.addEventListener("input", onSliderChange);
waterSlider.addEventListener("input", onSliderChange);
coffeeSlider.addEventListener("input", onSliderChange);

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
    markAsValidOrInvalid(timerInput);

    if (isValid(timerInput)) {
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
