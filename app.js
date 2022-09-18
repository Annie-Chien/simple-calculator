class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operator = undefined;
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return; //防止小數點超過一個
    if (number === '.' && this.currentOperand === '') return; //防止使用者在還沒輸入數字之前就先點擊小數點
    this.currentOperand = this.currentOperand + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return; //防止使用者在還沒輸入數字之前就先點擊運算鍵
    if (this.previousOperand !== '') {
      this.calculate();
    }
    this.operator = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }
  calculate() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const cur = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(cur)) return;
    switch (this.operator) {
      case '+':
        computation = prev + cur;
        break;
      case '-':
        computation = prev - cur;
        break;
      case '*':
        computation = prev * cur;
        break;
      case '/':
        computation = prev / cur;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operator = undefined;
    this.previousOperand = '';
  }

  getFormattedNum(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let formattedInteger;

    if (isNaN(integerDigits)) {
      formattedInteger = '';
    } else {
      formattedInteger = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${formattedInteger}.${decimalDigits}`;
    } else {
      return formattedInteger;
    }
  }

  updateDisplay() {
    if (isNaN(this.currentOperand)) {
      this.previousOperandElement.textContent = 'Please press button C ';
      this.currentOperandElement.textContent = 'ERROR';
      return;
    }
    this.currentOperandElement.textContent = this.getFormattedNum(
      this.currentOperand
    );

    if (this.operator !== undefined) {
      this.previousOperandElement.textContent = `${this.getFormattedNum(
        this.previousOperand
      )} ${this.operator}`;
    } else {
      this.previousOperandElement.textContent = this.getFormattedNum(
        this.previousOperand
      );
    }
  }
}

const numberBtns = document.querySelectorAll('.number');
const operationBtns = document.querySelectorAll('.operation');
const clearBtn = document.querySelector('.clear');
const equalBtn = document.querySelector('.equal');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

const calculator = new Calculator(
  previousOperandElement,
  currentOperandElement
);

clearBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

numberBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    calculator.appendNumber(btn.textContent);
    calculator.updateDisplay();
  });
});

operationBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    calculator.chooseOperation(btn.dataset.operator);
    calculator.updateDisplay();
  });
});

equalBtn.addEventListener('click', () => {
  calculator.calculate();
  calculator.updateDisplay();
});

/////////////////////////////////////////////
//鍵盤功能 (待重構)
/////////////////////////////////////////////
window.addEventListener('keydown', (e) => {
  //數字鍵
  numberBtns.forEach((btn) => {
    if (btn.textContent === e.key) {
      calculator.appendNumber(e.key);
      calculator.updateDisplay();
      btn.classList.add('hover');
    }
  });
  //運算鍵
  operationBtns.forEach((btn) => {
    if (btn.dataset.operator === e.key) {
      calculator.chooseOperation(e.key);
      calculator.updateDisplay();
      btn.classList.add('hover');
    }
  });
  //等於
  if (e.key === 'Enter' || e.key === '=') {
    calculator.calculate();
    calculator.updateDisplay();
    equalBtn.classList.add('hover');
  }
  //clear
  if (e.key === 'c' || e.key === 'C') {
    calculator.clear();
    calculator.updateDisplay();
    clearBtn.classList.add('hover');
  }
});

window.addEventListener('keyup', (e) => {
  numberBtns.forEach((btn) => {
    btn.textContent === e.key && btn.classList.remove('hover');
  });
  operationBtns.forEach((btn) => {
    btn.dataset.operator === e.key && btn.classList.remove('hover');
  });
  equalBtn.classList.remove('hover');
  clearBtn.classList.remove('hover');
});
