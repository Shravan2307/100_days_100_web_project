// --- DOM ELEMENT SELECTORS ---
const display = document.querySelector('.calculator-screen') || document.querySelector('#display');
const calculatorKeys = document.querySelector('.calculator-keys') || document.querySelector('.buttons') || document.querySelector('.calc-container');

// --- INITIAL APPLICATION STATE ---
let calculatorState = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// --- CORE PROCESSING LOGIC ---

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculatorState;

    if (waitingForSecondOperand === true) {
        calculatorState.displayValue = digit;
        calculatorState.waitingForSecondOperand = false;
    } else {
        calculatorState.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculatorState.waitingForSecondOperand === true) {
        calculatorState.displayValue = "0.";
        calculatorState.waitingForSecondOperand = false;
        return;
    }

    if (!calculatorState.displayValue.includes(dot)) {
        calculatorState.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculatorState;
    const inputValue = parseFloat(displayValue);

    if (operator && calculatorState.waitingForSecondOperand) {
        calculatorState.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculatorState.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculatorState.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculatorState.firstOperand = result;
    }

    calculatorState.waitingForSecondOperand = true;
    calculatorState.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') return firstOperand / secondOperand;
    return secondOperand;
}

function resetCalculator() {
    calculatorState.displayValue = '0';
    calculatorState.firstOperand = null;
    calculatorState.waitingForSecondOperand = false;
    calculatorState.operator = null;
}

function updateDisplay() {
    if (display) {
        display.value = calculatorState.displayValue;
    }
}

// --- ADVANCED EVENT DELEGATION GLOBAL SUBSYSTEM ---
// Captures bubbling button clicks at the container level to minimize memory footprint
if (calculatorKeys) {
    calculatorKeys.addEventListener('click', (event) => {
        // Isolate the target element button click
        const targetBtn = event.target.closest('button');

        // Guard Clause: Exit if the click lands on background grid spacing/borders
        if (!targetBtn) return;

        // Route actions based on class assignments or value datasets
        if (targetBtn.classList.contains('operator') || targetBtn.hasAttribute('data-operator')) {
            handleOperator(targetBtn.value || targetBtn.innerText);
            updateDisplay();
            return;
        }

        if (targetBtn.classList.contains('decimal') || targetBtn.innerText === '.') {
            inputDecimal('.');
            updateDisplay();
            return;
        }

        if (targetBtn.classList.contains('all-clear') || targetBtn.classList.contains('clear')) {
            resetCalculator();
            updateDisplay();
            return;
        }

        // Default handling falls back to standard digits
        inputDigit(targetBtn.value || targetBtn.innerText);
        updateDisplay();
    });
}

// Initial UI setup update
updateDisplay();