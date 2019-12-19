// Skrypt front-endu

const question = document.querySelector('#question');
const answer1 = document.querySelector('#answer1');
const answer2 = document.querySelector('#answer2');
const answer3 = document.querySelector('#answer3');
const answer4 = document.querySelector('#answer4');
const gameBoard = document.querySelector('#game-board');
const h2 = document.querySelector('h2');


function fillQuestionElements(data) { //funkcja do podstawiania pytań i odpowiedzi 
    
    if(data.winner === true) {
        gameBoard.style.display = 'none';
        h2.innerText = 'WYGRANA!';
        return;
    }
    
    if(data.loser === true) {
        gameBoard.style.display = 'none';
        h2.innerText = 'Nie poszło tym razem!';
        return;
    }

    //question.innerHTML = data.question //przestroga, aby do podstawiania tekstu nei urzywać "innerHTML"
    question.innerText = data.question;
    answer1.innerText = data.answers[0];
    answer2.innerText = data.answers[1];
    answer3.innerText = data.answers[2];
    answer4.innerText = data.answers[3];

    // for(let i=1; i<=data.answers.length; i++) {
    //     (answer+Number.toString(i).innerText) = data.answers[i]; 
    //     //console.log("hejka", ans);
    //     //ans = data.answers[i];
    // }
}


function showNextQuestion() {
    fetch('/question', {
        method: 'GET', //metoda domyślna, nie trzeba jej pisać
    })
    .then( r => r.json())
    .then( data => {
        //console.log(data);
        fillQuestionElements(data);
    });
}

showNextQuestion();

//------------------------------------------------------------------------

const goodAnswersSpan = document.querySelector('#good-answers');

function handleAnswerFeedback(data) {
    goodAnswersSpan.innerText = data.goodAnswers;
    showNextQuestion();
}


function sendAnswer(answerIndex) {
    fetch(`/answer/${answerIndex}`, {
        method: 'POST', //WYSYŁANIE odpowiedzi
    })
    .then( r => r.json())
    .then( data => {
        console.log(data);
        handleAnswerFeedback(data);
        
    });
}

const buttons = document.querySelectorAll('.answer-btn');
for(const button of buttons) {
    button.addEventListener('click', (event) => {
        const answerIndex = event.target.dataset.answer;
        console.log('przycisk', answerIndex);
        sendAnswer(answerIndex);
    })
}

//------------------------------------------------------------------------
//Koło ratunkowe telefon
const tip = document.querySelector('#tip');
function handleFriendsAnswer(data) {
    tip.innerText = data.text;
}

function callToFriend() {
    console.log('elefon');
    fetch(`/help/friend`, {
        method: 'GET',
    })
    .then( r => r.json())
    .then( data => {
        console.log(data);
        handleFriendsAnswer(data);
    });
}

document.querySelector('#callToFriend').addEventListener('click', callToFriend);

//------------------------------------------------------------------------
//Kolo ratunkowe pół / pół
function handleHalfOnHalf(data) {
    if(typeof data.text === 'string') {
        tip.innerText = data.text;
    } else {
        for(const button of buttons) {
            if(data.answerToRemove.indexOf(button.innerText) > -1 ) { //jeżeli element istnieje w tej tablicy
                button.innerText = '';
            }
        }
    }
}

function halfOnHalf() {
    //console.log('pol/pol');
    fetch(`/help/half`, {
        method: 'GET',
    })
    .then( r => r.json())
    .then( data => {
        console.log(data);
        handleHalfOnHalf(data);
    });
}

document.querySelector('#halfOnHalf').addEventListener('click', halfOnHalf);

//------------------------------------------------------------------------
//Pytanie do publiczności

function handleQuestionToTheCrowd(data) {
    console.log(data);
    if(typeof data.text === 'string') {
        tip.innerText = data.text;
    } else {
        //for(const percent of data.chart) {
            //if(data.answerToRemove.indexOf(button.innerText) > -1 ) { //jeżeli element istnieje w tej tablicy
            //    button.innerText = '';
            //}
        //}
        data.chart.forEach((percent, index) => {
            buttons[index].innerText = buttons[index].innerText + ': ' + percent + '%'
        });
    }
}

function questionToTheCrowd() {
    //console.log('pol/pol');
    fetch(`/help/crowd`, {
        method: 'GET',
    })
    .then( r => r.json())
    .then( data => {
        //console.log(data);
        handleQuestionToTheCrowd(data);
    });
}

document.querySelector('#questionToTheCrowd').addEventListener('click', questionToTheCrowd);






