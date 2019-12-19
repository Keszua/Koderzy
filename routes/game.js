function gameRoutes(app) {


    let goodAnswers = 0;
    let isGameOver = false;
    let callToFriendUsed = false;
    let questionToTheCrowdUsed = false;
    let halfOnHalfUsed = false;

    const questions = [
        {
            question: 'Jakiego koloru jest czerwony maluch?',
            answers: ['Zielony', 'Czerwony', 'Zółty','Czarny'],
            correctAnswer: 1,
        },
        {
            question: 'Najlepszy język programowania?',
            answers: ['C++', 'Fortran', 'JavaScript','Java'],
            correctAnswer: 2,
        },
        {
            question: 'Czy chcesz zjeść pizzę?',
            answers: ['Nawet dwie!', 'Jestem na diecie', 'Nie, dziękuje','Wolę brokuły'],
            correctAnswer: 0,
        },
    ]

//------------------------------------------------------------------------
// obsługa pobierania pytań z serwera
    app.get('/question', (req, res) => {

        if(goodAnswers === questions.length) {
            res.json({
                winner: true,
            });
        } else if (isGameOver) {
            res.json({
                loser: true,
            });
        } else {
            const nextQuestion = questions[goodAnswers];
            
            const {question, answers} = nextQuestion; //destrukturyzacja
            
            res.json({
                question, answers,
            });
        }
    });

//------------------------------------------------------------------------

    app.post('/answer/:index', (req, res) => {  // po dwukropku podajemy nazwę dowolnej przyjętej ścieżki

        if(isGameOver) {
            res.json({
                loser: true,
            });
        }

        const {index} = req.params; //destrukturyzacja parametru
        //console.log(index);
        const question = questions[goodAnswers];
        
        const isGoodAnswer = question.correctAnswer === Number(index);

        if(isGoodAnswer) {
            goodAnswers++;
        } else {
            isGameOver = true;
        }

        console.log(goodAnswers);

        // if(question.correctAnswer === Number(index)) {
        //     res.json({
        //         correct: true
        //     });
        // } else {
        //     res.json({
        //         correct: false
        //     });
        // }

        //to samo co wyżej, tylko krócej:
        //res.json({
        //    correct: question.correctAnswer === Number(index) ? true : false,
        //});

        //to samo co wyżej, tylko jeszcze krócej:
        res.json({
            correct: isGoodAnswer,
            goodAnswers,
        });
    });

//------------------------------------------------------------------------

    app.get('/help/friend', (req, res) => {

        if(callToFriendUsed) {
            return res.json({
                text: "To koło ratunkowe było już wykorzystane.",
            });
        }

        callToFriendUsed = true;

        const doesFriendKnowAnswer = Math.random() < 0.5;
        const question = questions[goodAnswers];

        res.json({
            text: doesFriendKnowAnswer ? 
            `Hmm, wydaje mi się, że odpowiedz to ${question.answers[question.correctAnswer]}.` 
            : `Hmm, no nie wiem.`,
        });

    });

//------------------------------------------------------------------------
    app.get('/help/half', (req, res) => {

        if(halfOnHalfUsed) {
            return res.json({
                text: "To koło ratunkowe było już wykorzystane.",
            });
        }

        halfOnHalfUsed = true;

        const question = questions[goodAnswers];
        //tworze kopie tablicy, w ktorej nie ma prawidłowej odpowiedzi
        const answersCopy = question.answers.filter((s, index) => (
                index !== question.correctAnswer
            )
        );
        
        //usuwanie losowego elementu z tablicy
        answersCopy.splice(~~(Math.random()* answersCopy.length), 1);

        res.json({
            answerToRemove: answersCopy,
            //text: "hejko, pol na pol",
        });

    });

//------------------------------------------------------------------------
//pytanie do publiczności
//filmik 77
app.get('/help/crowd', (req, res) => {

    if(questionToTheCrowdUsed) {
        return res.json({
            text: "To koło ratunkowe było już wykorzystane.",
        });
    }

    //questionToTheCrowdUsed = true;

    const chart = [10, 20, 30, 40];

    for(let i = chart.length -1; i>0; i--) {
        const change = Math.floor(Math.random() * 20 -10);
        chart[i] += change;
        chart[i-1] -= change;
    }

    const question = questions[goodAnswers];
    const {correctAnswer} = question; //destrukturyzacja
    //przez destrukturyzacje na tablicy, robione jest zamienianie dwuch elementów miejscami
    //jak w sortowaniu bąbelkowym, wstawia "dobrą odpowiedz" w odpowiednie miejsce 
    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]]

    res.json({
        //answerToRemove: answersCopy,
        //text: "Publiczność",
        chart,
    });

});




}

module.exports = gameRoutes;