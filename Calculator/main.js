// Getting the main elements of the DOM

const $body = 		document.querySelector("body");
const $display = 	document.querySelector("#display");
const $log = 		document.querySelector("#log")
const $keypad = 	document.querySelector("#keypad");
const $themeBtn = 	document.querySelector("#theme-btn");

// Event for the Calculator Switch button. 
// When clicking the #theme-btn element, the 'dark' class is toggled to the body.
// When the 'dark' class is enabled on the body, all the indirect and direct children elements will have their styles updated.

$themeBtn.addEventListener("click", (event) => {
	$body.classList.toggle("dark");
})

// Event for when the DOM is loaded. 
// It resets the textual content of the #display and #log elements .

window.addEventListener("DOMContentLoaded", (event) => {
	clearScreen();
});

// Events for keypad buttons.
// It checks that the element clicked inside the #keypad container has the 'keypad-btn' class.
// If the condition is fulfilled, it checks the data-action attribute content and executes the corresponding function.
// The font size of the #display element is adapted in function of the number of characters inside.

$keypad.addEventListener("click", (event) => {
	const $element = event.target;

	if ($element.matches(".keypad-btn")) {
		switch ($element.dataset.action) {
			case "clearScreen": 	clearScreen(); break;
			case "clearEntry": 		clearEntry(); 	break;
			case "calc": 			calc(); 		break;
			case "switchSign":		switchSign();	break;
			default: addEntry($element);
		}

		adaptDisplayFontSize();
		//makeCalc($display.textContent);
	}
});

// -- ClearScreen --
// It resets the #log and #display textual content.

function clearScreen() {
	$log.textContent = '';
	$display.textContent = '0';
}

// -- ClearEntry --
// It removes the last character in the #display, by assigning again its textual content without the last character. 

function clearEntry() {
	if ($display.textContent.length === 1) {
		$display.textContent = '0';
	} else {
		$display.textContent = $display.textContent.slice(0, -1);
	}
}

// -- DisplayResult --
// When the evaluation of the arithmetic operation in the #display element is successful:
// 1. The #log element logs the last operation.
// 2. The #display element display the last result of the operation.
// 3. The operation is logged in the console.

function displayResult(result) {
	$log.textContent 		= $display.textContent;
	$display.textContent 	= result;
	
	console.log(`${$log.textContent} = ${result}`);
}

// -- Calc --
// It tries to evaluate the arithmetic operation.
// When successful, displayResult function is executed.
// When failed, it logs the error type in the #log element, with a sad face.

function calc() {
	try {
		const result = eval($display.textContent);

		displayResult(result);
	} catch (e) {
		$log.textContent = e.name + ' :(';
	}
}

// -- SwitchSign --
// Switches the sign of the last typed number in the $display element.
// NOTE: We had a hard work with regular expressions to get this point... regexr.com has been a nice website to build them.

function switchSign() {
	const posBeginningRegExp = 	new RegExp(/^[1-9]\d*(\.\d*)?$/);	//Checks if the sign is going to be switched when the number is at the begging of the display and is positive.
	const negBeginningRegExp = 	new RegExp(/^\-\d+(\.\d*)?$/);		//Checks if the sign is going to be switched when the number is at the begging of the display and is negative.
	const opPositiveRegExp = 	new RegExp(/[*/%]\d+(\.\d*)?$/);	//Checks if the sign is going to be switched when the number is after *, / or % operator and is positive.
	const opNegativeRegExp = 	new RegExp(/[*/%]\-\d+(\.\d*)?$/);	//Checks if the sign is going to be switched when the number is after *, / or % operator and is negative.
	const addRegExp	=			new RegExp(/\+\d+(\.\d*)?$/);		//Checks if the sign is going to be switched when the number is after + operator.
	const subRegExp = 			new RegExp(/\-\d+(\.\d*)?$/);		//Checks if the sign is going to be switched when the number is after - operator.
	
	// If one of the following conditions is fulfilled, the string in the #display element will be trimmed and appended again with the sign of the last number switched.  
	if (posBeginningRegExp.test($display.textContent)) {
		const index = $display.textContent.search(posBeginningRegExp);
		$display.textContent = '-' + $display.textContent;
	} else if (negBeginningRegExp.test($display.textContent)) {
		const index = $display.textContent.search(negBeginningRegExp);
		$display.textContent = $display.textContent.slice(1);
	} else if (opPositiveRegExp.test($display.textContent)) {
		const index = $display.textContent.search(opPositiveRegExp);
		$display.textContent = $display.textContent.slice(0, index + 1) + '-' + $display.textContent.slice(index + 1);
	} else if (opNegativeRegExp.test($display.textContent)) {
		const index = $display.textContent.search(opNegativeRegExp);
		$display.textContent = $display.textContent.slice(0, index + 1) + $display.textContent.slice(index + 2);
	} else if (addRegExp.test($display.textContent)) {
		const index = $display.textContent.search(addRegExp);
		$display.textContent = $display.textContent.slice(0, index) + '-' + $display.textContent.slice(index + 1);
	} else if (subRegExp.test($display.textContent)) {
		const index = $display.textContent.search(subRegExp);
		$display.textContent = $display.textContent.slice(0, index) + '+' + $display.textContent.slice(index + 1);
	} 
}

// -- AddEntry --
// When the #display element has less or equal to 40 chars, it checks the entry type, specified in the data-type attribute, and executes the corresponding function.

function addEntry($element) {
	const length = $display.textContent.length;

	if(length <= 40){
		switch ($element.dataset.type) {
			case "number": 		addNumber($element); 	break;
			case "operator": 	addOperator($element); 	break;
			case "dot": 		addDot(); 				break;
		}
	}
}

// -- AddNumber --
// When the #display content is not '0', it appends the number of the pressed button.
// Otherwise, is replaced with the typed number.

function addNumber($numKey) {
	if ($display.textContent !== '0') {
		$display.textContent += $numKey.textContent;
	} else {
		$display.textContent = $numKey.textContent;
	}
}

// -- AddOperator --
// When the last character is an operator, this one is replace with the operator of the pressed button.
// Otherwise, when it's a number or a dot, the operator is appended.

function addOperator($operatorKey) {
	const operatorList = ["+","-","*","/","%"];
	const operator = $operatorKey.textContent;
	const lastChar = $display.textContent.slice(-1);

	if (operatorList.includes(lastChar)) {
		$display.textContent = $display.textContent.slice(0, -1) + operator;
	} else {
		$display.textContent += operator;
	}
}

// -- AddDot --
// It adds a dot once per number. In order to add a dot, it's checked that the number was preceded by an operator or the beginning of the string. 

function addDot() {
	const regexp = new RegExp(/(^|[\+\-\*\/\%])\d+$/);

	if (regexp.test($display.textContent)) {
		$display.textContent += '.';
	}
}

// -- AdaptDisplayFontSize --
// It adapts the font size in #display, according to the number of characters.

function adaptDisplayFontSize() {
	const length = $display.textContent.length;

	if (length < 10) {
		$display.style.removeProperty("font-size");
	} else if (length < 16) {
		$display.style.fontSize = "2rem";
	} else if (length < 22) {
		$display.style.fontSize = "1.5rem";
	} else if (length < 28) {
		$display.style.fontSize = "1.25rem";
	} else if (length < 34) {
		$display.style.fontSize = "1rem";
	} else {
		$display.style.fontSize = "0.75rem";
	}
}