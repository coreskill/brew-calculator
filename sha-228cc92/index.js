const beansInput = document.querySelector("#beans");
const ratioInput = document.querySelector("#ratio");

const waterInput = document.querySelector("#water");
const coffeeInput = document.querySelector("#coffee");

const calculateWater = (beans, ratio) => {
    let water = beans * ratio;
    let coffee = water * 0.9;

    return {water, coffee};
};

const onInputChange = () => {
    if (beansInput.validity.valid) {
        let {water, coffee} = calculateWater(beansInput.valueAsNumber, ratioInput.valueAsNumber);

        waterInput.value = water;
        coffeeInput.value = coffee;
    } else {
        waterInput.value = "";
        coffeeInput.value = "";
    }
};

beansInput.addEventListener("input", onInputChange);
ratioInput.addEventListener("input", onInputChange);

onInputChange();
