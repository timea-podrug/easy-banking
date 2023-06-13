'use strict';

// BANK PROJECT

// USER DATA
const account1 = {
  owner: 'Timea Podrug',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-06-10T14:11:59.604Z',
    '2023-06-12T17:01:17.194Z',
    '2023-06-12T23:36:17.929Z',
    '2023-06-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Lana Todorovski',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Karlo Marasović',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Tina Dobričić',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// ARRAY OF ALL THE ACCOUNTS
const accounts = [account1, account2, account3, account4];

// DECLARED ALL ELEMENTS THAT WILL BE USED
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
//buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
//input
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//FUNCTIONS

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// displayMovements deletes the example movements and then with a forEach method and a turnary operator checks if the movement is grater then 0 and depending on that sets it to deposit/withdrawal. In html variable i copy the html code and set dinamic values.
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    // I use .insertAdjacentHTML - afterbegin so that the added elements show up on top of each other.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculating the balance off the account with reduce method - adding up all the deposits and withdrawals to a single value.
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//USERNAMES
//For the usernames i want to use the first letters of the first name and the last name so for example if the user is Timea Podrug i want the tp to be the username.

const user = 'Lana Todorovski';
const createUsername = acc =>
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
createUsername(accounts);

//update UI function
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };
  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//LOGIN

let currentAcccout, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //check if username is correct
  currentAcccout = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAcccout);
  //check if pin in correct and set text to a welcome message with user name
  if (currentAcccout?.pin === Number(inputLoginPin.value)) {
    //sets the welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAcccout.owner.split(' ')[0]
    }`;
    //display information and remove username and pin from being visible
    containerApp.style.opacity = 100;
    //sets date and time depending on users local data
    const now = new Date();
    //how it will be formated
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    //sets date by the users locale variable defined in the object
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcccout.locale,
      options
    ).format(now);
    //clears inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //checks if timer already exists and if it does it delets it so that we do not have two timers running at the same time
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //update user interface
    updateUI(currentAcccout);
  }
});

//LOAN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAcccout.movements.some(mov => mov >= amount * 0.1)) {
    //sets a timeout so that when we request a loan it takes three seconds to get it
    setTimeout(function () {
      currentAcccout.movements.push(amount);

      //add loan date
      currentAcccout.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAcccout);

      //Reset timer - I want the timer to reset if there is any activity(it is there to log out the user after five minutes of inactivity)
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
    //clear input
    inputLoanAmount.value = '';
  }
});

//TRANSFERS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //empty the transfer inputs
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAcccout.balance >= amount &&
    receiverAcc?.username !== currentAcccout.username
  ) {
    currentAcccout.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAcccout.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //update user interface
    updateUI(currentAcccout);
    //Reset timer - I want the timer to reset if there is any activity(it is there to log out the user after five minutes of inactivity)
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //checks if username and pin are correct
  if (
    currentAcccout.username === inputCloseUsername.value &&
    currentAcccout.pin === Number(inputClosePin.value)
  ) {
    //finds the index of the accout of the user and removes it from the list
    const index = accounts.findIndex(
      acc => acc.username === currentAcccout.username
    );
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputClosePin.value = inputCloseUsername.value = '';
  }
  //clears the inputs
  (inputClosePin.value === inputCloseUsername.value) === '';
});

//SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcccout, !sorted);
  sorted = !sorted;
});
