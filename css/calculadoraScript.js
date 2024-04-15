// script.js
const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let currentOperator = "";
let shouldClearDisplay = false;
let concurrentOperation = false;    //Used to control if there's a pending operation

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.textContent;
        display.style.color = "black";
        if (buttonText === "C") {
            display.textContent = "0";
            currentInput = "";
            currentOperator = "";
        }
        else if (buttonText.match(/[0-9.]/)) {
            // Calculator only accepts 14 digits
            
            if (shouldClearDisplay) {
                display.textContent = "";
                shouldClearDisplay = false;
            }
            //Clears the leading zero
            else if(display.textContent=="0")
                display.textContent = "";
            else if(display.textContent.length>=14)
            {
                // Sets text to red if there's more than 14 digits
                display.style.color = "red";
                alert('Calculator only accepts 14 digits');
                return;
            }
                
            display.textContent += buttonText;
        }
        else if ((buttonText === "*" || buttonText === "/" || buttonText === "-" || buttonText === "+")) {
            //Checks if there's a pending operation and does it
            if (concurrentOperation) { 
                calculate(parseFloat(currentInput), currentOperator, parseFloat(display.textContent));
                currentOperator = buttonText; 
            } else {
                currentOperator = buttonText; 
                currentInput = display.textContent;
                shouldClearDisplay = true;
                concurrentOperation = true;
            }
        }
        else if (buttonText === "=") {
            if (currentOperator && currentInput) {
                calculate(parseFloat(currentInput), currentOperator, parseFloat(display.textContent));
                currentOperator = "";
            }
            concurrentOperation = false;
        } 
    });
});

function calculate(num1, operator, num2) {
    
    let result;
    switch (operator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            if (num2 !== 0) {
                result = num1 / num2;
            } else {
                result = "Error";
            }
            break;
        default:
            result = num2;
            break;
    }
    //Makes the change of the display since the same code is used when checking
    // for pending operations and pressing the equals button.
    if (result <= 9999999999999) {
        display.textContent = result.toString().substring(0, 14);
    }
    else {
        display.textContent = "OVERFLOW";
        display.style.color = "red";
    }

    currentInput = result;
    shouldClearDisplay = true;
    return result;
}