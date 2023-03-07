//Calculator class contains basic arithmetic operations and trigonometric operations

class Calculator {
    static reset() {
        Calculator.result = undefined;
        Calculator.operator = undefined;
        Calculator.equated = undefined;
    }
    static add(a, b) {
        return a + b;
    }
    static substract(a, b) {
        return a - b;
    }
    static multiply(a, b) {
        return a * b;
    }
    static divide(a, b) {
        return a / b;
    }
    static sin(a) {
        return Math.sin(a);
    }
    static tan(a){
        return Math.tan(a);
    }

    static cos(a){
        return Math.cos(a);
    }

    static atan(a) {
        return Math.atan(a)
    }

    // Put contains of input to a memory
    static getMem(mem) {
        return UI.display(Calculator.mem)
    }
    //retrieve the memory cell
    static setMem(mem) {
        Calculator.mem = mem;
    }
    //remove the memory cell
    static delMem() {
        Calculator.mem = 0;
    }

    static operate(input, operator) {
        if (Calculator.operator === undefined) {
            Calculator.operator = operator;
        }

        if (Calculator.result === undefined ) {
            Calculator.result = input;

        }
        //Continuing Calculation after equating
        else if (Calculator.equated && Number.isNaN(input)) {
            Calculator.equated = false;
        }
        // Switching Operator in Between Calculation
        else if((Number.isNaN(input) && Calculator.result != undefined)){
            Calculator.operator = operator;
            return;
        }
        else {

            // Run Calculation
            Calculator.result = Calculator[Calculator.operator](Calculator.result, input);

            if(Calculator.trigonometry.includes(Calculator.operator)) {
                Calculator.result = Calculator[Calculator.operator](input);
            }

            if (!(operator === 'equate')) {
                Calculator.operator = operator;
                Calculator.equated = false;
            } else {
                Calculator.operator = undefined;
                Calculator.equated = true;
            }

        }

        return (Calculator.result);

    }
}


Calculator.result;
Calculator.operator;
Calculator.equated;
Calculator.trigonometry = ['sin','cos','tan','atan'];
Calculator.mem;

//class Event to capture click event and numpad-keyboard event
class Event {
    static captureInput() {

        //numpad keyboard event
        document.onkeydown = function (e) {
            UI.displayBar.focus();
            let key = e.key;

            switch (true) {
                case (parseFloat(key) >= 0 && parseFloat(key) <= 9) || key === '.':
                    Event.inputNumber(e, key);
                    break;
                case key === '*' :
                    Event.inputAction(e,'multiply');
                    break;
                case key === '/':
                    Event.inputAction(e,'divide');
                    break;
                case key === '-':
                    Event.inputAction(e,'substract');
                    break;
                case key === '+':
                    Event.inputAction(e,'add');
                    break;
                case key === 'Enter':
                    Event.inputAction(e,'equate');
                    break;
                case key === 'Backspace': //remove from input
                    if(Event.inputString.length > 0) {
                        Event.inputString = Event.inputString.slice(0, -1);
                    }
                    break;
                default:
                    e.preventDefault();  //prevent clicking other symbols, letters etc non-numeric
            }
        }

        //event on numpad UI click
        Event.inputSource.addEventListener('click', (e) => {

            // Capturing the clicked number
            if (e.target.className === 'numpad') {
                Event.inputNumber(e, e.target.textContent);
                UI.display(Event.inputString);
            } else if (e.target.className === 'operator' || e.target.className === 'equate') {
                if(Calculator.trigonometry.includes(e.target.dataset.action)){
                    Calculator.reset();
                }

                Event.inputAction(e, e.target.dataset.action);
            } else if (e.target.className === 'key-mem') {
                Calculator[e.target.dataset.action](UI.displayBar.value);
            } else if (e.target.dataset.action === 'clear') {
                Event.reset();
                Calculator.reset();
                UI.display(0);
            }
        });
    }

    static inputNumber(e, key){
        //Reset if there was '=' before
        if(Event.inputMemory === 'equate'){
            Event.reset();
            Calculator.reset();
            UI.display(0);
        }

        if (/\./.test(key)) {
            if (!(/\./.test(Event.inputString))) {
                if(Event.inputString.length < UI.displayLimit){Event.inputString += key}
            }
        } else {
            if(Event.inputString.length < UI.displayLimit){
                UI.displayBar.value = Event.inputString.indexOf('.') === -1 ? Event.inputString.replace(/^0+/,""): Event.inputString;

                Event.inputString += key
            }
        }
        Event.inputMemory = 'number';
    }

    static inputAction(e, action){
        if(!(Event.inputMemory === action)) {

            Event.selectedOperator = action;

            UI.display(Calculator.operate(parseFloat(Event.inputString), Event.selectedOperator));

            // Clear Input String
            Event.inputString = '';

            // Saves Clicked Operator to Memory
            Event.inputMemory = action;
        }
    }

    static reset(){
        Event.inputString = '';
        Event.selectedOperator = undefined;
        Event.inputMemory = '';
    }

    static init() {
        document.addEventListener("DOMContentLoaded", function () {
            Event.captureInput();
        });
    }
}

Event.inputSource = document.querySelector('.calculator-keys');
Event.inputString = '';
Event.selectedOperator;
Event.inputMemory = '';
class UI {
    static display(value) {

        if(typeof(value)==="string"){
            // Limit String to Display Limit of Calculator

            UI.displayBar.value = value.substring(0, UI.displayLimit);

        } else if (Calculator.trigonometry.includes(Event.selectedOperator) && !value) {
            UI.displayBar.value = Event.selectedOperator + ' ';
        }
        else if(typeof(value)==="number"){

            if(value < ((Math.pow(10,UI.displayLimit))-1)){

                UI.displayableDecimalTrail =  (UI.displayLimit) - (value.toString().split(".")[0].length);
                if(value %1 !== 0){
                    UI.displayBar.value = parseFloat(value.toFixed(UI.displayableDecimalTrail));
                } else {
                    UI.displayBar.value = value;
                }

            } else {
                UI.displayBar.value = 'E';
            }
        }
    }
}

UI.displayBar = document.querySelector('.calculator-input');
UI.displayLimit = 12;
UI.displayableDecimalTrail;



// Listen For Input / Focus on input
Event.init();
UI.displayBar.focus();