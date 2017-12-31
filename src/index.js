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

const writeInputValues = () => {
    beansInput.value = beans;
    ratioInput.value = ratio;
    waterInput.value = water;
    coffeeInput.value = coffee;
};

beansInput.addEventListener("input", onInputChange);
ratioInput.addEventListener("input", onInputChange);
waterInput.addEventListener("input", onInputChange);
coffeeInput.addEventListener("input", onCoffeeInputChange);

writeInputValues();
